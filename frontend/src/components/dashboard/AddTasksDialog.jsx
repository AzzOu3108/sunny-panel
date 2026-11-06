import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { getErrorMessage } from "../../lib/api";

export default function AddTasksDialog({ onClose, onSubmit }) {
  const [tasks, setTasks] = useState([""]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateTask = (index, value) => {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) => (taskIndex === index ? value : task)),
    );
    setError(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    const taskList = tasks.map((task) => task.trim()).filter(Boolean);
    if (!taskList.length) {
      setError("Enter at least one task.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(taskList);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to add tasks. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141E3C]/45 p-4 backdrop-blur-lg"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-project-tasks-heading"
        className="w-full max-w-md rounded-3xl bg-[#FBF3EC] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="add-project-tasks-heading"
              className="text-2xl font-extrabold tracking-tight text-foreground"
            >
              Add tasks
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Add one or more tasks to this project.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit}>
          <ul className="mt-5 space-y-3">
            {tasks.map((task, index) => (
              <li key={index} className="flex items-center gap-2">
                <input
                  autoFocus={index === 0}
                  value={task}
                  onChange={(event) => updateTask(index, event.target.value)}
                  aria-label={`Task ${index + 1}`}
                  placeholder="Enter a task"
                  className="h-11 min-w-0 flex-1 rounded-full border border-[#EBDCCB] bg-white px-5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  disabled={tasks.length === 1 || submitting}
                  onClick={() =>
                    setTasks((currentTasks) =>
                      currentTasks.filter((_, taskIndex) => taskIndex !== index),
                    )
                  }
                  aria-label={`Remove task ${index + 1}`}
                  className="rounded-full p-2 text-red-500 hover:bg-red-100 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setTasks((currentTasks) => [...currentTasks, ""])}
            disabled={submitting}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add another task
          </button>

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-11 rounded-full px-5 text-sm font-semibold text-muted-foreground hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add tasks"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
