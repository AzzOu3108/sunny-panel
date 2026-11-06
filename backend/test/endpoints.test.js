const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')

process.env.JWT_SECRET = 'test-access-secret'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
process.env.NODE_ENV = 'test'

const app = require('../app')
const User = require('../models/User')
const Project = require('../models/Project')
const RefreshToken = require('../models/RefreshToken')
let requestIpCounter = 1

app.set('trust proxy', 1)

const makeQuery = (value) => {
    const query = Promise.resolve(value)
    query.select = () => query
    query.sort = () => query
    return query
}

const makeTask = (task) => ({
    _id: task._id || randomUUID(),
    id: task.id || task._id || randomUUID(),
    text: task.text,
    completed: task.completed || false,
})

const makeProject = (data) => {
    const tasks = (data.tasks || []).map(makeTask)
    tasks.push = (...newTasks) => Array.prototype.push.apply(tasks, newTasks.map(makeTask))
    const project = {
        _id: randomUUID(),
        id: '',
        owner: data.owner,
        title: data.title,
        dueDate: data.dueDate,
        tasks,
        async save() {},
    }
    project.id = project._id
    project.tasks.id = (id) => project.tasks.find((task) => task.id === id || task._id === id)
    return project
}

const startApi = async (t) => {
    const users = new Map()
    const refreshTokens = new Map()
    const projects = new Map()

    const findUser = (filter) => [...users.values()].find((user) =>
        filter._id ? user.id === String(filter._id) : user.email === filter.email
    ) || null

    t.mock.method(User, 'findOne', (filter) => makeQuery(findUser(filter)))
    t.mock.method(User, 'findById', (id) => makeQuery(findUser({ _id: id })))
    t.mock.method(User, 'create', async (data) => {
        const user = { ...data, id: randomUUID() }
        users.set(user.id, user)
        return user
    })

    t.mock.method(RefreshToken, 'create', async (data) => {
        refreshTokens.set(data.tokenHash, data)
        return data
    })
    t.mock.method(RefreshToken, 'findOne', (filter) =>
        makeQuery(refreshTokens.get(filter.tokenHash) || null)
    )
    t.mock.method(RefreshToken, 'deleteOne', async (filter) => ({
        deletedCount: refreshTokens.delete(filter.tokenHash) ? 1 : 0,
    }))

    t.mock.method(Project, 'find', (filter) => makeQuery(
        [...projects.values()].filter((project) => project.owner === String(filter.owner))
    ))
    t.mock.method(Project, 'create', async (data) => {
        const project = makeProject(data)
        projects.set(project.id, project)
        return project
    })
    t.mock.method(Project, 'findOne', (filter) => makeQuery(
        [...projects.values()].find((project) =>
            project.id === String(filter._id) && project.owner === String(filter.owner)
        ) || null
    ))
    t.mock.method(Project, 'findOneAndDelete', async (filter) => {
        const project = [...projects.values()].find((item) =>
            item.id === String(filter._id) && item.owner === String(filter.owner)
        )
        if (project) projects.delete(project.id)
        return project || null
    })

    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    t.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve())
    }))

    const baseUrl = `http://127.0.0.1:${server.address().port}`
    const request = async (path, { method = 'GET', body, token } = {}) => {
        const response = await fetch(`${baseUrl}${path}`, {
            method,
            headers: {
                ...(body === undefined ? {} : { 'content-type': 'application/json' }),
                ...(token ? { authorization: `Bearer ${token}` } : {}),
                'x-forwarded-for': `10.0.0.${requestIpCounter++}`,
            },
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        })
        const data = response.status === 204 ? null : await response.json()
        return { status: response.status, data }
    }

    const signup = async (email = `${randomUUID()}@example.com`) => {
        const response = await request('/api/auth/signup', {
            method: 'POST',
            body: { fullName: 'Test User', email, password: 'password123' },
        })
        assert.equal(response.status, 201)
        return response.data
    }

    return { request, signup }
}

test('health and unknown endpoints', async (t) => {
    const { request } = await startApi(t)

    assert.deepEqual(await request('/api/health'), {
        status: 200,
        data: { message: 'Server is healthy' },
    })
    const missing = await request('/api/does-not-exist')
    assert.equal(missing.status, 404)
    assert.match(missing.data.error, /No route/)
})

test('signup and login validate credentials and return tokens', async (t) => {
    const { request } = await startApi(t)
    const email = `${randomUUID()}@example.com`

    assert.equal((await request('/api/auth/signup', {
        method: 'POST',
        body: { email, password: 'password123' },
    })).status, 400)
    assert.equal((await request('/api/auth/signup', {
        method: 'POST',
        body: { fullName: 'Test User', email, password: 'short' },
    })).status, 400)

    const created = await request('/api/auth/signup', {
        method: 'POST',
        body: { fullName: 'Test User', email: email.toUpperCase(), password: 'password123' },
    })
    assert.equal(created.status, 201)
    assert.equal(created.data.user.email, email)
    assert.ok(created.data.accessToken)
    assert.ok(created.data.refreshToken)
    assert.equal('password' in created.data.user, false)

    assert.equal((await request('/api/auth/signup', {
        method: 'POST',
        body: { fullName: 'Duplicate', email, password: 'password123' },
    })).status, 409)

    assert.equal((await request('/api/auth/login', {
        method: 'POST',
        body: { email },
    })).status, 400)
    assert.equal((await request('/api/auth/login', {
        method: 'POST',
        body: { email, password: 'incorrect' },
    })).status, 401)

    const login = await request('/api/auth/login', {
        method: 'POST',
        body: { email: email.toUpperCase(), password: 'password123' },
    })
    assert.equal(login.status, 200)
    assert.ok(login.data.accessToken)
    assert.ok(login.data.refreshToken)
})

test('refresh and logout endpoints validate and revoke refresh tokens', async (t) => {
    const { request, signup } = await startApi(t)
    const user = await signup()

    assert.equal((await request('/api/auth/refresh', {
        method: 'POST',
        body: {},
    })).status, 401)
    assert.equal((await request('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: 'invalid' },
    })).status, 403)

    const refreshed = await request('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: user.refreshToken },
    })
    assert.equal(refreshed.status, 200)
    assert.ok(refreshed.data.accessToken)

    assert.equal((await request('/api/auth/logout', {
        method: 'POST',
        body: { refreshToken: user.refreshToken },
    })).status, 204)
    assert.equal((await request('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: user.refreshToken },
    })).status, 403)
    assert.equal((await request('/api/auth/logout', {
        method: 'POST',
        body: {},
    })).status, 204)
})

test('/auth/me requires a valid access token', async (t) => {
    const { request, signup } = await startApi(t)
    const user = await signup()

    assert.equal((await request('/api/auth/me')).status, 401)
    assert.equal((await request('/api/auth/me', { token: 'invalid' })).status, 401)

    const profile = await request('/api/auth/me', { token: user.accessToken })
    assert.equal(profile.status, 200)
    assert.deepEqual(profile.data.user, user.user)
})

test('project endpoints enforce authentication, validation, and ownership', async (t) => {
    const { request, signup } = await startApi(t)
    const owner = await signup()
    const otherUser = await signup()

    assert.equal((await request('/api/projects')).status, 401)
    assert.equal((await request('/api/projects', {
        method: 'POST',
        body: { title: 'Private project' },
    })).status, 401)
    assert.equal((await request('/api/projects/not-owned', {
        method: 'DELETE',
    })).status, 401)
    assert.equal((await request('/api/projects', {
        method: 'POST',
        token: owner.accessToken,
        body: { title: ' ' },
    })).status, 400)
    assert.equal((await request('/api/projects', {
        method: 'POST',
        token: owner.accessToken,
        body: { title: 'Bad tasks', tasks: 'not-an-array' },
    })).status, 400)

    const created = await request('/api/projects', {
        method: 'POST',
        token: owner.accessToken,
        body: { title: '  My project  ', dueDate: '2026-12-01', tasks: ['First task'] },
    })
    assert.equal(created.status, 201)
    assert.equal(created.data.title, 'My project')
    assert.equal(created.data.owner, owner.user.id)

    const ownProjects = await request('/api/projects', { token: owner.accessToken })
    assert.equal(ownProjects.status, 200)
    assert.equal(ownProjects.data.length, 1)

    assert.equal((await request(`/api/projects/${created.data.id}`, {
        method: 'DELETE',
        token: otherUser.accessToken,
    })).status, 404)
    assert.equal((await request(`/api/projects/${created.data.id}`, {
        method: 'DELETE',
        token: owner.accessToken,
    })).status, 204)
    assert.equal((await request(`/api/projects/${created.data.id}`, {
        method: 'DELETE',
        token: owner.accessToken,
    })).status, 404)
})

test('task endpoints enforce authentication, ownership, and task existence', async (t) => {
    const { request, signup } = await startApi(t)
    const owner = await signup()
    const otherUser = await signup()
    const project = await request('/api/projects', {
        method: 'POST',
        token: owner.accessToken,
        body: { title: 'Tasks project' },
    })
    const foreignProject = await request('/api/projects', {
        method: 'POST',
        token: otherUser.accessToken,
        body: { title: 'Another user project' },
    })

    assert.equal((await request(`/api/projects/${project.data.id}/tasks`, {
        method: 'POST',
        body: { tasks: ['unauthorized'] },
    })).status, 401)
    assert.equal((await request(`/api/projects/${project.data.id}/tasks/${randomUUID()}`, {
        method: 'PATCH',
        body: { completed: true },
    })).status, 401)
    assert.equal((await request(`/api/projects/${project.data.id}/tasks`, {
        method: 'POST',
        token: owner.accessToken,
        body: { tasks: [] },
    })).status, 400)
    assert.equal((await request(`/api/projects/${project.data.id}/tasks`, {
        method: 'POST',
        token: owner.accessToken,
        body: { tasks: ['valid task', 42] },
    })).status, 400)
    assert.equal((await request(`/api/projects/not-a-project/tasks`, {
        method: 'POST',
        token: owner.accessToken,
        body: { tasks: ['missing project'] },
    })).status, 404)

    const added = await request(`/api/projects/${project.data.id}/tasks`, {
        method: 'POST',
        token: owner.accessToken,
        body: { tasks: ['Write tests'] },
    })
    assert.equal(added.status, 200)
    assert.equal(added.data.tasks.length, 1)
    const taskId = added.data.tasks[0].id

    const toggled = await request(`/api/projects/${project.data.id}/tasks/${taskId}`, {
        method: 'PATCH',
        token: owner.accessToken,
        body: { completed: true },
    })
    assert.equal(toggled.status, 200)
    assert.equal(toggled.data.completed, true)

    assert.equal((await request(`/api/projects/${foreignProject.data.id}/tasks`, {
        method: 'POST',
        token: owner.accessToken,
        body: { tasks: ['not allowed'] },
    })).status, 404)
    assert.equal((await request(`/api/projects/${project.data.id}/tasks/no-task`, {
        method: 'PATCH',
        token: owner.accessToken,
        body: { completed: true },
    })).status, 404)
})

test('stats are authenticated and scoped to the current user', async (t) => {
    const { request, signup } = await startApi(t)
    const owner = await signup()
    const otherUser = await signup()

    assert.equal((await request('/api/stats')).status, 401)

    const project = await request('/api/projects', {
        method: 'POST',
        token: owner.accessToken,
        body: { title: 'Owner project', tasks: ['One', 'Two'] },
    })
    await request('/api/projects', {
        method: 'POST',
        token: otherUser.accessToken,
        body: { title: 'Other project', tasks: ['Other task'] },
    })

    await request(`/api/projects/${project.data.id}/tasks/${project.data.tasks[0].id}`, {
        method: 'PATCH',
        token: owner.accessToken,
        body: { completed: true },
    })

    const stats = await request('/api/stats', { token: owner.accessToken })
    assert.equal(stats.status, 200)
    assert.deepEqual(stats.data, {
        totalProjects: 1,
        completedTasks: 1,
        pendingTasks: 1,
    })
})
