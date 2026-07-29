import Button from "../ui/Button";

export default function ProjectsSection() {
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
        <Button variant="primary" size="md" className="mt-5">
          <img src="/assets/DashBoard-assets/Add-icon.svg" alt="" className="h-4 w-4" />
          Create a new project
        </Button>
      </div>
    </section>
  );
}
