
const API_URL = "http://localhost:5017/api";

// Store the token after successful login or registration.
export function saveToken(token: string): void {
  localStorage.setItem("taskbridge_token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("taskbridge_token");
}

export function removeToken(): void {
  localStorage.removeItem("taskbridge_token");
}

// Send the token automatically with every API request.
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

export type AuthResponse = {
  token: string;
  userId: number;
  name: string;
  email: string;
};

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Registration failed");
  }

  const data: AuthResponse = await response.json();
  saveToken(data.token);
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Login failed");
  }

  const data: AuthResponse = await response.json();
  saveToken(data.token);
  return data;
}

export type Project = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
  projectId: number;
};

export async function getProjects(): Promise<Project[]> {
  const response = await apiRequest("/projects");

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function getTasks(): Promise<Task[]> {
  const response = await apiRequest("/tasks");

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function createProject(project: {
  name: string;
  description: string;
}): Promise<Project> {
  const response = await apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

export async function updateProject(
  id: number,
  project: { name: string; description: string }
): Promise<void> {
  const response = await apiRequest(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }
}

export async function deleteProject(id: number): Promise<void> {
  const response = await apiRequest(`/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
}

export async function createTask(task: {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
  projectId: number;
}): Promise<Task> {
  const response = await apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function updateTask(
  id: number,
  task: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
    projectId: number;
  }
): Promise<void> {
  const response = await apiRequest(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }
}

export async function deleteTask(id: number): Promise<void> {
  const response = await apiRequest(`/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
