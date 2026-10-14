
using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Project
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // The user who owns this project
    public int? UserId { get; set; }

    public User? User { get; set; }
    public List<TaskItem> Tasks { get; set; } = new();
}
