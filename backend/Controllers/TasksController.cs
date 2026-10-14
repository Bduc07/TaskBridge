
using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // GET: api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
    {
        var userId = GetUserId();

        var tasks = await _context.Tasks
            .Where(task => task.Project != null
                && task.Project.UserId == userId)
            .ToListAsync();

        return Ok(tasks);
    }

    // GET: api/tasks/1
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    {
        var userId = GetUserId();

        var task = await _context.Tasks
            .FirstOrDefaultAsync(task =>
                task.Id == id
                && task.Project != null
                && task.Project.UserId == userId);

        if (task == null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
    {
        var userId = GetUserId();

        var projectExists = await _context.Projects
            .AnyAsync(project =>
                project.Id == task.ProjectId
                && project.UserId == userId);

        if (!projectExists)
        {
            return BadRequest(new
            {
                message = "The selected project does not exist or does not belong to you."
            });
        }

        task.Id = 0;
        task.Project = null;

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTask),
            new { id = task.Id },
            task);
    }

    // PUT: api/tasks/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(
        int id, TaskItem updatedTask)
    {
        var userId = GetUserId();

        var task = await _context.Tasks
            .FirstOrDefaultAsync(task =>
                task.Id == id
                && task.Project != null
                && task.Project.UserId == userId);

        if (task == null)
        {
            return NotFound();
        }

        // Also check ownership if the task is moved to another project.
        var projectExists = await _context.Projects
            .AnyAsync(project =>
                project.Id == updatedTask.ProjectId
                && project.UserId == userId);

        if (!projectExists)
        {
            return BadRequest(new
            {
                message = "The selected project does not exist or does not belong to you."
            });
        }

        task.Title = updatedTask.Title;
        task.Description = updatedTask.Description;
        task.Status = updatedTask.Status;
        task.Priority = updatedTask.Priority;
        task.DueDate = updatedTask.DueDate;
        task.ProjectId = updatedTask.ProjectId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = GetUserId();

        var task = await _context.Tasks
            .FirstOrDefaultAsync(task =>
                task.Id == id
                && task.Project != null
                && task.Project.UserId == userId);

        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
