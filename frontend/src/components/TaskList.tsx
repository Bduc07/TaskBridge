export type Task = {
  id: number;
  title: string;
  status: string;
  priority: string;
  projectName: string;
};

type TaskListProps = {
  tasks: Task[];
};

function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-row" key={task.id}>
          <div>
            <h4>{task.title}</h4>
            <p>{task.projectName}</p>
          </div>

          <span className="task-status">{task.status}</span>
          <span className="task-priority">{task.priority}</span>
        </div>
      ))}
    </div>
  );
}

export default TaskList;