import { cn } from "../../lib/utils";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6 shadow-(--shadow-card)",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
