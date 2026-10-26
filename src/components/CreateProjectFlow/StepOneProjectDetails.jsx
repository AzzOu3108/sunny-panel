import { cn } from "@/lib/utils";
import Button from "../ui/Button";
import TaskNumberStepper from "./TaskNumberStepper";
import { Calendar, ChevronDown } from "lucide-react";
import arrowIcon from "../../assets/Landing-assets/All-Icons/Icons-Arrow.svg";

const todayISO = (() => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
})();

const inputClasses =
  "h-12 w-full rounded-full border border-[#EBDCCB] bg-white px-5 text-sm text-foreground placeholder:text-muted-foreground/60 transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40";

const fieldLabelClasses = "text-sm font-semibold text-foreground";

const errorTextClasses = "text-xs font-medium text-red-500";

export default function StepOneProjectDetails({
  active,
  formData,
  errors,
  updateFormData,
  onNext,
  onCancel,
}) {
  return (
    <section
      inert={!active}
      aria-hidden={!active}
      className={cn(
        "col-start-1 row-start-1 min-w-0 transition-all duration-200 ease-in-out motion-reduce:transition-none",
        active ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0 pointer-events-none",
      )}
    >
      <h2
        id="create-project-heading"
        className="text-2xl font-extrabold tracking-tight text-foreground"
      >
        let's build something great
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Start by giving your project a name, defining the number of tasks and setting a deadline.
      </p>

      <div className="mt-5">
        <label htmlFor="project-title" className={fieldLabelClasses}>
          Project Title
        </label>
        <input
          id="project-title"
          type="text"
          autoFocus
          value={formData.title}
          onChange={(event) => updateFormData({ title: event.target.value })}
          placeholder="Name exemple"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "project-title-error" : undefined}
          className={cn(
            inputClasses,
            "mt-2",
            errors.title && "border-red-500 ring-2 ring-red-500/30",
          )}
        />

        <div className="mt-1.5 min-h-5">
          {errors.title && (
            <p id="project-title-error" className={errorTextClasses}>
              {errors.title}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <span id="task-number-label" className={fieldLabelClasses}>
          Task number
        </span>
        <TaskNumberStepper
          value={formData.taskCount}
          onChange={(taskCount) => updateFormData({ taskCount })}
          ariaLabelledBy="task-number-label"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="project-due-date" className={fieldLabelClasses}>
          Due date
        </label>
        <div className="relative mt-2">
          <Calendar
            className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
            aria-hidden="true"
          />
          <input
            id="project-due-date"
            type="date"
            min={todayISO}
            value={formData.dueDate}
            onChange={(event) => updateFormData({ dueDate: event.target.value })}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? "project-due-date-error" : undefined}
            className={cn(
              inputClasses,
              "appearance-none pl-12 pr-12 [&::-webkit-calendar-picker-indicator]:hidden",
              errors.dueDate && "border-red-500 ring-2 ring-red-500/30",
            )}
          />
          <ChevronDown
            className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        {/* Fixed slot so validation never changes the form's height */}
        <div className="mt-1.5 min-h-5">
          {errors.dueDate && (
            <p id="project-due-date-error" className={errorTextClasses}>
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 -mx-1 mt-6 flex items-center justify-between gap-3 bg-[#FBF3EC] px-1">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="h-12 rounded-full px-6 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="h-12 px-7 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Go Next
          <img src={arrowIcon} alt="" className="h-3.5 w-3.5" />
        </Button>
      </div>
    </section>
  );
}
