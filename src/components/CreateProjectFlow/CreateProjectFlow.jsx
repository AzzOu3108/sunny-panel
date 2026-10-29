import { useEffect, useRef, useState } from "react";
import StepOneProjectDetails from "./StepOneProjectDetails";
import StepTwoTasks from "./StepTwoTasks";
import { getErrorMessage } from "../../lib/api";

const EMPTY_FORM = {
  title: "",
  taskCount: 5,
  dueDate: "",
  tasks: [],
};

/**
 * Two-step "Create Project" flow.
 * Owns the shared form state + step navigation so nothing is lost when
 * going back and forth between the steps.
 */
export default function CreateProjectFlow({ onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({ title: null, dueDate: null, tasks: null });
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef(null);
  const previouslyFocused = useRef(null);

  const isDirty = Boolean(
    formData.title.trim() || formData.dueDate || formData.tasks.some((task) => task.trim()),
  );

  // Lock body scroll while open and restore focus to the trigger on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
  }, []);

  // Escape closes (with confirmation if the draft has content); Tab is trapped.
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        requestClose();
      } else if (event.key === "Tab") {
        trapFocus(event);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // After a failed validation, bring the first invalid field into view only
  // if it is genuinely out of sight — no scrolling when it's already visible.
  useEffect(() => {
    const target =
      (errors.title && "#project-title") ||
      (errors.dueDate && "#project-due-date") ||
      (errors.tasks && "#tasks-error");
    if (!target) return;
    const card = cardRef.current;
    const element = card?.querySelector(target);
    if (!card || !element) return;

    const cardRect = card.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    if (elementRect.top >= cardRect.top && elementRect.bottom <= cardRect.bottom) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  }, [errors]);

  function trapFocus(event) {
    if (!cardRef.current) return;
    const focusables = Array.from(
      cardRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.closest("[inert]"));

    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // If focus slipped outside the dialog (e.g. after clicking card padding),
    // pull it back in instead of letting Tab escape the modal.
    if (!cardRef.current.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function updateFormData(patch) {
    setFormData((prev) => ({ ...prev, ...patch }));
    setSubmitError(null);
    // Clear the error for any field the user is actively editing.
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => {
        next[key] = null;
      });
      return next;
    });
  }

  function validateStepOne() {
    const nextErrors = { title: null, dueDate: null, tasks: null };

    if (!formData.title.trim()) {
      nextErrors.title = "Give your project a name.";
    }

    if (!formData.dueDate) {
      nextErrors.dueDate = "Choose a due date.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(`${formData.dueDate}T00:00:00`);
      if (Number.isNaN(dueDate.getTime()) || dueDate < today) {
        nextErrors.dueDate = "The date must be today or later.";
      }
    }

    setErrors(nextErrors);
    return !nextErrors.title && !nextErrors.dueDate;
  }

  function goNext() {
    if (!validateStepOne()) return;
    setFormData((prev) => ({
      ...prev,
      taskCount: Math.max(1, prev.taskCount),
      tasks: Array.from(
        { length: Math.max(1, prev.taskCount) },
        (_, index) => prev.tasks[index] ?? "",
      ),
    }));
    setStep(2);
  }

  function goBack() {
    setStep(1);
  }

  async function handleSubmit() {
    const tasks = (formData.tasks ?? []).map((task) => task.trim()).filter(Boolean);
    if (tasks.length === 0) {
      setErrors((prev) => ({ ...prev, tasks: "Add at least one task." }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      taskCount: tasks.length,
    }));

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onComplete({
        title: formData.title.trim(),
        dueDate: formData.dueDate,
        tasks,
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Unable to create the project. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function requestClose() {
    if (isDirty && !window.confirm("Discard this project draft?")) return;
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141E3C]/45 p-4 backdrop-blur-lg animate-in fade-in duration-200 motion-reduce:animate-none"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={step === 1 ? "create-project-heading" : "add-tasks-heading"}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-y-auto rounded-3xl bg-[#FBF3EC] p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in-95 duration-200 ease-out motion-reduce:animate-none"
      >
        <div className="grid px-1">
          <StepOneProjectDetails
            active={step === 1}
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            onNext={goNext}
            onCancel={requestClose}
          />
          <StepTwoTasks
            active={step === 2}
            formData={formData}
            errors={errors}
            submitError={submitError}
            isSubmitting={isSubmitting}
            updatedFormData={updateFormData}
            onBack={goBack}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
