import SearchBar from "./SearchBar";
import Button from "../ui/Button";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <a href="/" className="flex shrink-0">
          <img
            src="/assets/DashBoard-assets/logo.svg"
            alt="Manag'it"
            className="h-8"
          />
        </a>

        <SearchBar placeholder="Search projects, tasks, or members..." />

        <div className="ml-auto flex items-center gap-3">
          <Button variant="primary" size="md">
            <img src="/assets/DashBoard-assets/Add-icon.svg" alt="" className="h-4 w-4" />
            <span className="hidden sm:inline">Create a new project</span>
          </Button>
          <Button variant="icon" size="icon" aria-label="Account">
            <img src="/assets/DashBoard-assets/Profil-icon.svg" alt="" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
