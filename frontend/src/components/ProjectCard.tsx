type ProjectCardProps = {
  name: string;
  description: string;
  taskCount: number;
};

function ProjectCard({
  name,
  description,
  taskCount,
}: ProjectCardProps) {
  return (
    <div className="project-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <span>{taskCount} tasks</span>
    </div>
  );
}

export default ProjectCard;