import Button from "../ui/Button";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection({
  projects = [],
  onCreateProject,
  onToggleTask,
  onAddTasks,
  onDeleteProject,
  openMenuProjectId,
  onMenuOpenChange,
}) {
  if (projects.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="text-xl font-bold text-foreground">Active Projects</h2>
        <div className="mt-8 flex flex-col items-center justify-center py-10 text-center">
          <img
            src="/assets/DashBoard-assets/Illustration-EmptyState.png"
            alt="No projects"
            className="h-20 w-auto"
          />
          <h3 className="mt-5 text-lg font-bold text-foreground">No projects yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            How about creating a project right now?
          </p>
          <Button variant="primary" size="md" className="mt-5" onClick={onCreateProject}>
            <img src="/assets/DashBoard-assets/Add-icon.svg" alt="" className="h-4 w-4" />
            Create a new project
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground">Active Projects</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onToggleTask={onToggleTask}
            onOpenAddTasks={() => onAddTasks(project.id)}
            onDeleteProject={onDeleteProject}
            menuOpen={openMenuProjectId === project.id}
            onMenuOpenChange={(open) => onMenuOpenChange(open ? project.id : null)}
          />
        ))}
      </div>
    </section>
  );
}
