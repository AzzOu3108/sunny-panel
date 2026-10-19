# Make the dashboard work with real data (JSX + Tailwind + server)

The dashboard already uses JSX and Tailwind, and runs on a Node-based dev setup. This plan makes it actually work: you can create projects and tasks, and the counts update.

## What you will get
- "Create a new project" opens a small form (name and description).
- New projects show as cards under "Active Projects", replacing the empty state.
- Each project card lets you add tasks and mark them done.
- Overview cards show real totals: Total Projects, Completed Tasks, Pending Tasks.
- The search bar filters projects by name.
- Data stays saved between page reloads.

## Technical details
- Enable Lovable Cloud for storage: `projects` and `tasks` tables (with grants and open access policies for now, since there is no sign-in yet).
- Server functions (`createServerFn`) in `src/lib/projects.functions.ts` for list/create project, add/toggle task.
- Route loader + React Query to load data; mutations refresh counts.
- Split UI into components: `Topbar`, `StatCard`, `ProjectCard`, `CreateProjectDialog`.
- Keep the current cream/orange design and Plus Jakarta Sans font.
- Files stay as `.tsx` (same JSX syntax, typed) to match the project setup.
