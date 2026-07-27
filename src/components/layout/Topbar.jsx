import { Plus, User } from "lucide-react";
import SearchBar from "./SearchBar";
import Button from "../ui/Button";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <a href="/" className="text-xl font-extrabold tracking-tight text-foreground">
          Manag<span className="text-primary">&apos;</span>it
        </a>

        <SearchBar placeholder="Search projects, tasks, or members..." />

        <div className="ml-auto flex items-center gap-3">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create a new project</span>
          </Button>
          <Button variant="icon" size="icon" aria-label="Account">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
