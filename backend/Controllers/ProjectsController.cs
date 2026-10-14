
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
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // GET: api/projects
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        var userId = GetUserId();

        var projects = await _context.Projects
            .Where(project => project.UserId == userId)
            .ToListAsync();

        return Ok(projects);
    }

    // GET: api/projects/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        var userId = GetUserId();

        var project = await _context.Projects
            .FirstOrDefaultAsync(project =>
                project.Id == id && project.UserId == userId);

        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    // POST: api/projects
    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject(Project project)
    {
        project.Id = 0;

        // Assign ownership from the verified token, not the request body.
        project.UserId = GetUserId();
        project.User = null;

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetProject),
            new { id = project.Id },
            project);
    }

    // PUT: api/projects/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(
        int id, Project updatedProject)
    {
        var userId = GetUserId();

        var project = await _context.Projects
            .FirstOrDefaultAsync(project =>
                project.Id == id && project.UserId == userId);

        if (project == null)
        {
            return NotFound();
        }

        project.Name = updatedProject.Name;
        project.Description = updatedProject.Description;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/projects/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var userId = GetUserId();

        var project = await _context.Projects
            .FirstOrDefaultAsync(project =>
                project.Id == id && project.UserId == userId);

        if (project == null)
        {
            return NotFound();
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
