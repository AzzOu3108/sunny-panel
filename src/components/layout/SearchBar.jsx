export default function SearchBar({ placeholder = "Search..." }) {
  return (
    <div className="relative hidden flex-1 sm:block">
      <img
        src="/assets/DashBoard-assets/Search-icon.svg"
        alt=""
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25"
      />
    </div>
  );
}
