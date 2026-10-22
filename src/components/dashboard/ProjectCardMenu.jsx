import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProjectCardMenu({ items = [], open, onOpenChange }) {
  const menuRef = useRef(null);
  const [flipUp, setFlipUp] = useState(false);

  //Close when a click/pointer press lands outside the menu
  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!menuRef.current?.contains(event.target)) onOpenChange(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  // Esc closes.
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // Measure once open: if it would run past the viewport, open upward.
  useEffect(() => {
    if (!open) return undefined;
    const rect = menuRef.current?.getBoundingClientRect();
    if (!rect) return undefined;
    setFlipUp(rect.bottom > window.innerHeight - 8);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Project options"
        className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <MoreVertical className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 z-20 w-44 rounded-2xl border border-border bg-surface p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none",
            flipUp ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {items.map((item) => (
            <div key={item.label}>
              {item.destructive && <div className="mx-1 my-1.5 border-t border-border" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onOpenChange(false);
                  item.onClick?.();
                }}

                className={cn(
                  "flex w-full items-center gap-2.5 rounded-full px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  item.destructive
                    ? "text-destructive hover:bg-red-50 hover:text-destructive"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
