import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function TaskInputRow({ index, value, onChange, onRemove, canRemove, inputRef }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
        {index + 1}
      </span>
      <input
        type="text"
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter the task here....."
        aria-label={`Task ${index + 1}`}
        className="h-11 min-w-0 flex-1 rounded-full border border-[#EBDCCB] bg-white px-5 text-sm text-foreground placeholder:text-muted-foreground/60 transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={`Delete task ${index + 1}`}
        className={cn(
          "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-red-500 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50",
          !canRemove && "cursor-not-allowed opacity-30 hover:bg-transparent",
        )}
      >
        <Trash2 className="h-5 w-5 text-red-500" />
      </button>
    </li>
  );
}
