import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "rounded-md border border-input bg-background text-foreground hover:bg-accent",
  ghost: "rounded-md hover:bg-accent hover:text-accent-foreground",
  icon: "rounded-full border border-border text-primary hover:bg-accent",
};

const sizes = {
  sm: "h-9 px-4 gap-2 text-sm",
  md: "h-11 px-5 gap-2 text-sm font-semibold",
  icon: "h-10 w-10",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
