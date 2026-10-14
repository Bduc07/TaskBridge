
import { useEffect, useState } from "react";
import {
  getProjects,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api";
import type { Project, Task as ApiTask } from "../api";

type TaskForm = {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: string;
};

const emptyForm: TaskForm = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
  projectId: "",
};

function Tasks() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setError("");
      const [taskData, projectData] = await Promise.all([
        getTasks(),
        getProjects(),
      ]);
      setTasks(taskData);
      setProjects(projectData);
    } catch {
      setError("Failed to load tasks or projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateField<K extends keyof TaskForm>(
    field: K,
    value: TaskForm[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.title.trim() || !form.projectId) {
      setError("Enter a task title and select a project.");
      return;
    }

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate
        ? new Date(`${form.dueDate}T00:00:00`).toISOString()
        : null,
      projectId: Number(form.projectId),
    };

    try {
      setError("");

      if (editingId === null) {
        await createTask(taskData);
      } else {
        await updateTask(editingId, taskData);
      }

      resetForm();
      await loadData();
    } catch {
      setError("Failed to save task. Please try again.");
    }
  }

  function handleEdit(task: ApiTask) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
      projectId: String(task.projectId),
    });
    setError("");
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");
      await deleteTask(id);

      if (editingId === id) {
        resetForm();
      }

      await loadData();
    } catch {
      setError("Failed to delete task.");
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Tasks</h1>
        <p>Create and manage tasks for your projects.</p>
      </header>

      <section className="project-form-card">
        <h2>{editingId === null ? "Add a Task" : "Edit Task"}</h2>

        {projects.length === 0 && !loading && (
          <p className="error-message">
            Create a project before adding a task.
          </p>
        )}

        <form onSubmit={handleSubmit} className="project-form">
          <label htmlFor="task-title">Task Title</label>
          <input
            id="task-title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Enter task title"
            required
          />

          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Describe the task"
            rows={3}
          />

          <label htmlFor="task-project">Project</label>
          <select
            id="task-project"
            value={form.projectId}
            onChange={(event) =>
              updateField("projectId", event.target.value)
            }
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={form.priority}
            onChange={(event) => updateField("priority", event.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label htmlFor="task-due-date">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            value={form.dueDate}
            onChange={(event) => updateField("dueDate", event.target.value)}
          />

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={projects.length === 0}
            >
              {editingId === null ? "Add Task" : "Save Changes"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="dashboard-section">
        <h2>Your Tasks ({tasks.length})</h2>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add your first one!</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => {
              const project = projects.find(
                (item) => item.id === task.projectId
              );

              return (
                <article className="task-row" key={task.id}>
                  <div>
                    <h4>{task.title}</h4>
                    <p>{project?.name ?? "Unknown project"}</p>
                    <p>{task.description || "No description"}</p>
                    <p>
                      Due:{" "}
                      {task.dueDate
                        ? task.dueDate.substring(0, 10)
                        : "No due date"}
                    </p>
                  </div>

                  <span className="task-status">{task.status}</span>
                  <span className="task-priority">{task.priority}</span>

                  <div className="project-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Tasks;
