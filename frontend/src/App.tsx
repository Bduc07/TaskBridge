
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import type { Task } from "./components/TaskList";
import {
  getProjects,
  getTasks,
  getToken,
  removeToken,
} from "./api";
import type { Project as ApiProject, Task as ApiTask } from "./api";
import Auth from "./Auth";
import "./App.css";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";

type DashboardProject = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(getToken())
  );

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [projectData, taskData]: [
          ApiProject[],
          ApiTask[]
        ] = await Promise.all([getProjects(), getTasks()]);

        setProjects(
          projectData.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            taskCount: taskData.filter(
              (task) => task.projectId === project.id
            ).length,
          }))
        );

        setTasks(
          taskData.map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            projectName:
              projectData.find(
                (project) => project.id === task.projectId
              )?.name ?? "Unknown project",
          }))
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong while loading data.";

        setError(message);

        if (message.includes("401")) {
          removeToken();
          setIsAuthenticated(false);
          setUserName("");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activePage, isAuthenticated]);

  function handleAuthenticated(name: string) {
    setUserName(name);
    setIsAuthenticated(true);
    setActivePage("Dashboard");
  }

  function handleLogout() {
    removeToken();
    setIsAuthenticated(false);
    setUserName("");
    setProjects([]);
    setTasks([]);
    setActivePage("Dashboard");
    setError("");
  }

  if (!isAuthenticated) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        userName={userName}
        onLogout={handleLogout}
      />

      <div className="main-content">
        <header className="app-header">
          <span>{activePage}</span>
        </header>

        {loading ? (
          <main className="dashboard">
            <p>Loading TaskBridge data...</p>
          </main>
        ) : error ? (
          <main className="dashboard">
            <h1>Unable to load TaskBridge data</h1>
            <p>{error}</p>
            <p>
              Check that the backend is running at http://localhost:5017.
            </p>
          </main>
        ) : activePage === "Dashboard" ? (
          <Dashboard projects={projects} tasks={tasks} />
        ) : activePage === "Projects" ? (
          <Projects />
        ) : activePage === "Tasks" ? (
          <Tasks />
        ) : (
          <main className="dashboard">
            <h1>{activePage}</h1>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
