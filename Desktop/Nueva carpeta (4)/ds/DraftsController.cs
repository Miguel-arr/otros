using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ExportadorDocumentos.Data;
using ExportadorDocumentos.Models;
using System.Security.Claims;

namespace ExportadorDocumentos.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DraftsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DraftsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/drafts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Draft>>> GetDrafts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return await _context.Drafts.Where(d => d.UserId == userId).ToListAsync();
    }

    // POST: api/drafts
    [HttpPost]
    public async Task<IActionResult> SaveDraft([FromBody] Draft draft)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        draft.UserId = userId;
        draft.UpdatedAt = DateTime.UtcNow;

        var existingDraft = await _context.Drafts
            .FirstOrDefaultAsync(d => d.UserId == userId && d.DocumentSeries == draft.DocumentSeries);

        if (existingDraft != null)
        {
            existingDraft.DataJson = draft.DataJson;
            existingDraft.UpdatedAt = draft.UpdatedAt;
            _context.Entry(existingDraft).State = EntityState.Modified;
        }
        else
        {
            _context.Drafts.Add(draft);
        }

        await _context.SaveChangesAsync();

        return Ok(draft);
    }

    // DELETE: api/drafts/{documentSeries}
    [HttpDelete("{documentSeries}")]
    public async Task<IActionResult> DeleteDraft(string documentSeries)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var draft = await _context.Drafts.FirstOrDefaultAsync(d => d.UserId == userId && d.DocumentSeries == documentSeries);

        if (draft == null)
        {
            return NotFound();
        }

        _context.Drafts.Remove(draft);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
