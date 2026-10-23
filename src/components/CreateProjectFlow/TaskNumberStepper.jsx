import { Minus, Plus } from "lucide-react";

const stepButtonClasses =
  "flex h-9 w-9 items-center justify-center rounded-full text-primary transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export default function TaskNumberStepper({ value, min = 1, max = 20, onChange, ariaLabelledBy }) {
  function stepBy(delta) {
    onChange(Math.min(max, Math.max(min, value + delta)));
  }

  return (
    <div
      role="group"
      aria-labelledby={ariaLabelledBy}
      className="mt-2 flex w-fit items-center gap-1 rounded-full border border-[#EBDCCB] bg-white p-1.5"
    >
      <button
        type="button"
        onClick={() => stepBy(-1)}
        disabled={value <= min}
        aria-label="Decrease task number"
        className={stepButtonClasses}
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
      <span className="w-10 text-center text-lg font-bold text-foreground" aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        onClick={() => stepBy(1)}
        disabled={value >= max}
        aria-label="Increase task number"
        className={stepButtonClasses}
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
