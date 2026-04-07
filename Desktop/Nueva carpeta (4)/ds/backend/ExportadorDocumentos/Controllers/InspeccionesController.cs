using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExportadorDocumentos.Data;
using ExportadorDocumentos.Models;
using System.Security.Claims;
using System.Text.Json;

namespace ExportadorDocumentos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InspeccionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InspeccionesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("guardar")]
        public async Task<IActionResult> GuardarProgreso([FromBody] GuardarProgresoRequest req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var inspeccion = await _context.InspeccionProgresos
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Serie == req.Serie && x.Seccion == req.Seccion);

            if (inspeccion == null)
            {
                inspeccion = new InspeccionProgreso
                {
                    UserId = userId,
                    Serie = req.Serie,
                    Seccion = req.Seccion,
                    DatosJson = req.DatosJson,
                    FechaCreacion = DateTime.UtcNow,
                    FechaActualizacion = DateTime.UtcNow
                };
                _context.InspeccionProgresos.Add(inspeccion);
            }
            else
            {
                inspeccion.DatosJson = req.DatosJson;
                inspeccion.FechaActualizacion = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { id = inspeccion.Id, message = "Progreso guardado correctamente." });
        }

        [HttpGet("pendientes")]
        public async Task<IActionResult> GetPendientes()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var pendientes = await _context.InspeccionProgresos
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.FechaActualizacion)
                .Select(x => new {
                    x.Id,
                    x.Serie,
                    x.Seccion,
                    x.FechaCreacion,
                    x.FechaActualizacion
                })
                .ToListAsync();

            return Ok(pendientes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInspeccion(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var inspeccion = await _context.InspeccionProgresos
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (inspeccion == null) return NotFound();

            return Ok(inspeccion);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProgreso(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var inspeccion = await _context.InspeccionProgresos
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (inspeccion == null) return NotFound();

            _context.InspeccionProgresos.Remove(inspeccion);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Progreso eliminado." });
        }
    }

    public class GuardarProgresoRequest
    {
        public string Serie { get; set; } = string.Empty;
        public string Seccion { get; set; } = string.Empty;
        public string DatosJson { get; set; } = "{}";
    }
}
