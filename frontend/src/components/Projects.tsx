
import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api";
import type { Project } from "../api";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setError("");
      const data = await getProjects();
      setProjects(data);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setError("");

      if (editingId === null) {
        await createProject({
          name: name.trim(),
          description: description.trim(),
        });
      } else {
        await updateProject(editingId, {
          name: name.trim(),
          description: description.trim(),
        });
      }

      resetForm();
      await loadProjects();
    } catch {
      setError("Failed to save project. Please try again.");
    }
  }

  function handleEdit(project: Project) {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setError("");
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project and its tasks?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteProject(id);
      await loadProjects();

      if (editingId === id) {
        resetForm();
      }
    } catch {
      setError("Failed to delete project.");
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Projects</h1>
        <p>Create and manage your projects.</p>
      </header>

      <section className="project-form-card">
        <h2>{editingId === null ? "Add a Project" : "Edit Project"}</h2>

        <form onSubmit={handleSubmit} className="project-form">
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter project name"
            required
          />

          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your project"
            rows={3}
          />

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId === null ? "Add Project" : "Save Changes"}
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
        <h2>Your Projects ({projects.length})</h2>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="empty-state">No projects yet. Add your first one!</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.description || "No description provided."}</p>

                <div className="project-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Projects;
