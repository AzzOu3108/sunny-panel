import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, User, FolderKanban, CheckCircle2, Clock, ClipboardList } from "lucide-react";
import ProjectCard from "../components/dashboard/ProjectCard";
import CreateProjectFlow from "../components/CreateProjectFlow/CreateProjectFlow";
import api, { getErrorMessage, isAuthenticated } from "../lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Manag'it Dashboard — Projects & Tasks Overview" },
      {
        name: "description",
        content:
          "Manag'it dashboard: track total projects, completed and pending tasks, and manage your active projects in one clean workspace.",
      },
      { property: "og:title", content: "Manag'it Dashboard — Projects & Tasks Overview" },
      {
        property: "og:description",
        content:
          "Track projects and tasks at a glance and create new projects from your Manag'it workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const statCards = [
  { label: "Total Projects", key: "totalProjects", icon: FolderKanban },
  { label: "Completed Tasks", key: "completedTasks", icon: CheckCircle2 },
  { label: "Pending Tasks", key: "pendingTasks", icon: Clock },
];

function Topbar({ onCreateProject, searchQuery, onSearchQueryChange }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <a href="/" className="text-xl font-extrabold tracking-tight text-foreground">
          Manag<span className="text-primary">&apos;</span>it
        </a>
        <div className="relative hidden flex-1 sm:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search projects, tasks, or members..."
            aria-label="Search projects, tasks, or members"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onCreateProject}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create a new project</span>
          </button>
          <button
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition hover:bg-accent"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Dashboard() {
  const navigate = Route.useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
      return () => {
        active = false;
      };
    }

    Promise.all([api.get("/projects"), api.get("/stats")])
      .then(([projectsResponse, statsResponse]) => {
        if (!Array.isArray(projectsResponse.data)) {
          throw new Error("The projects response was not a list.");
        }
        if (!active) return;
        setProjects(projectsResponse.data);
        setStats(statsResponse.data);
      })
      .catch((error) => {
        if (active) {
          setDashboardError(getErrorMessage(error, "Unable to load your dashboard."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const openCreateProject = () => setCreateProjectOpen(true);
  const closeCreateProject = () => setCreateProjectOpen(false);
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredProjects = normalizedSearchQuery
    ? projects.filter(
        (project) =>
          project.title.toLocaleLowerCase().includes(normalizedSearchQuery) ||
          project.tasks.some((task) =>
            task.text.toLocaleLowerCase().includes(normalizedSearchQuery),
          ),
      )
    : projects;

  const refreshStats = async () => {
    const { data } = await api.get("/stats");
    setStats(data);
    setDashboardError(null);
  };

  const handleCreateProject = async ({ title, dueDate, tasks }) => {
    setDashboardError(null);
    const { data: project } = await api.post("/projects", { title, dueDate, tasks });
    setProjects((currentProjects) => [project, ...currentProjects]);
    closeCreateProject();
    refreshStats().catch((error) => {
      setDashboardError(
        getErrorMessage(error, "Project created, but stats could not be refreshed."),
      );
    });
  };

  const handleToggleTask = async (projectId, taskId) => {
    const project = projects.find((item) => item.id === projectId);
    const task = project?.tasks.find((item) => item.id === taskId);
    if (!task) return;

    try {
      const { data: updatedTask } = await api.patch(`/projects/${projectId}/tasks/${taskId}`, {
        completed: !task.completed,
      });
      setDashboardError(null);
      setProjects((currentProjects) =>
        currentProjects.map((item) =>
          item.id === projectId
            ? {
                ...item,
                tasks: item.tasks.map((currentTask) =>
                  currentTask.id === taskId ? updatedTask : currentTask,
                ),
              }
            : item,
        ),
      );
      refreshStats().catch((error) => {
        setDashboardError(
          getErrorMessage(error, "Task updated, but stats could not be refreshed."),
        );
      });
    } catch (error) {
      setDashboardError(getErrorMessage(error, "Unable to update this task."));
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setDashboardError(null);
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId),
      );
      refreshStats().catch((error) => {
        setDashboardError(
          getErrorMessage(error, "Project deleted, but stats could not be refreshed."),
        );
      });
    } catch (error) {
      setDashboardError(getErrorMessage(error, "Unable to delete this project."));
    }
  };

  return (
    <div className="min-h-screen bg-background font-display">
      <Topbar
        onCreateProject={openCreateProject}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to your project workspace. Manage your projects efficiently and stay organized.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground">Overview</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map(({ label, key, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-foreground">{stats?.[key] ?? 0}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-foreground">Active Projects</h2>

          {dashboardError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {dashboardError}
            </p>
          )}

          {loading ? (
            <p className="mt-8 text-sm text-muted-foreground" role="status">
              Loading projects...
            </p>
          ) : filteredProjects.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
                <ClipboardList className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-foreground">
                {normalizedSearchQuery ? "No matching projects" : "No projects yet"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {normalizedSearchQuery
                  ? "Try a different project or task name."
                  : "How about creating a project right now?"}
              </p>
              {!normalizedSearchQuery && (
                <button
                  type="button"
                  onClick={openCreateProject}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Create a new project
                </button>
              )}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleTask={handleToggleTask}
                  onOpenAddTasks={() => undefined}
                  onDeleteProject={handleDeleteProject}
                  menuOpen={menuOpenId === project.id}
                  onMenuOpenChange={(next) => setMenuOpenId(next ? project.id : null)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {createProjectOpen && (
        <CreateProjectFlow onClose={closeCreateProject} onComplete={handleCreateProject} />
      )}
    </div>
  );
}
