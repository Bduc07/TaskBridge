import ProjectCard from "./ProjectCard";
import TaskList, { type Task } from "./TaskList";

type Project = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

type DashboardProps = {
  projects: Project[];
  tasks: Task[];
};

function Dashboard({ projects, tasks }: DashboardProps) {
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Here's an overview of your projects and tasks.</p>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <p>Total Projects</p>
          <h2>{projects.length}</h2>
        </div>

        <div className="stat-card">
          <p>Total Tasks</p>
          <h2>{tasks.length}</h2>
        </div>

        <div className="stat-card">
          <p>Completed Tasks</p>
          <h2>{completedTasks}</h2>
        </div>

        <div className="stat-card">
          <p>Pending Tasks</p>
          <h2>{pendingTasks}</h2>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Your Projects</h2>

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                description={project.description}
                taskCount={project.taskCount}
              />
            ))
          ) : (
            <p className="empty-state">No projects yet.</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Tasks</h2>
        <TaskList tasks={tasks} />
      </section>
    </main>
  );
}

export default Dashboard;