import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, User, FolderKanban, CheckCircle2, Clock, ClipboardList } from "lucide-react";
import ProjectCard from "../components/dashboard/ProjectCard";

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

const demoProjects = [
  {
    id: "project-1",
    title: "Website Redesign",
    dueDate: "2026-11-15",
    tasks: [
      { id: "task-1", text: "Finalize homepage sections", completed: true },
      { id: "task-2", text: "Review mobile navigation", completed: false },
      { id: "task-3", text: "Send design handoff", completed: false },
    ],
  },
  {
    id: "project-2",
    title: "Marketing Campaign",
    dueDate: "2026-12-03",
    tasks: [
      { id: "task-4", text: "Prepare launch brief", completed: true },
      { id: "task-5", text: "Confirm ad creatives", completed: true },
      { id: "task-6", text: "Schedule social posts", completed: false },
    ],
  },
];

const stats = [
  { label: "Total Projects", value: "2", icon: FolderKanban },
  { label: "Completed Tasks", value: "3", icon: CheckCircle2 },
  { label: "Pending Tasks", value: "3", icon: Clock },
];

function Topbar() {
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
            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
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
  const [projects, setProjects] = useState(demoProjects);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleToggleTask = (projectId, taskId) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id !== projectId
          ? project
          : {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task,
              ),
            },
      ),
    );
  };

  const handleDeleteProject = (projectId) => {
    setProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId));
  };

  return (
    <div className="min-h-screen bg-background font-display">
      <Topbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to your project workspace. Manage your projects efficiently and stay organized.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground">Overview</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
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

          {projects.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
                <ClipboardList className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-foreground">No projects yet</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                How about creating a project right now?
              </p>
              <button className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                <Plus className="h-4 w-4" />
                Create a new project
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
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
    </div>
  );
}
