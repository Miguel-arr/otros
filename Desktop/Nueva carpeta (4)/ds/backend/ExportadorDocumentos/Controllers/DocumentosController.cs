using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExportadorDocumentos.Models;
using ExportadorDocumentos.Services;
using System.IO.Compression;
using System.IO;

namespace ExportadorDocumentos.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentosController : ControllerBase
{
    private readonly DocumentGeneratorFactory _documentFactory;
    private readonly PdfService _pdfService;
    private readonly ILogger<DocumentosController> _logger;

    public DocumentosController(DocumentGeneratorFactory documentFactory, PdfService pdfService, ILogger<DocumentosController> logger)
    {
        _documentFactory = documentFactory;
        _pdfService = pdfService;
        _logger = logger;
    }

    /// <summary>
    /// Único endpoint del motor agnóstico.
    /// Recibe el nombre de la plantilla, la hoja y un JSON libre con los datos.
    /// El motor itera sobre las llaves del JSON y reemplaza los placeholders
    /// {{llave}} en la plantilla Excel.
    /// </summary>
    [HttpPost("generar")]
    public IActionResult GenerarDocumento([FromBody] GenerarDocumentoRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Plantilla))
            return BadRequest(new { message = "El campo 'plantilla' es requerido." });

        // El campo 'hoja' solo es obligatorio para Excel (.xlsx)
        bool esExcel = Path.GetExtension(req.Plantilla).Equals(".xlsx", StringComparison.OrdinalIgnoreCase);
        if (esExcel && string.IsNullOrWhiteSpace(req.Hoja))
            return BadRequest(new { message = "El campo 'hoja' es requerido para plantillas Excel." });

        if (req.Datos == null || req.Datos.Count == 0)
            return BadRequest(new { message = "El campo 'datos' no puede estar vacío." });

        var username = User.Identity?.Name ?? "anónimo";
        _logger.LogInformation("Usuario {Username} generando documento: {Plantilla}",
            username, req.Plantilla);

        var generator = _documentFactory.GetGenerator(req.Plantilla);
        var archivo = generator.GenerarDesdeJson(req.Plantilla, req.Hoja, req.Datos);
        var extension = Path.GetExtension(req.Plantilla).ToLowerInvariant();
        string nombreBase = Path.GetFileNameWithoutExtension(req.Plantilla) + "_Generado";
        
        // Convertir a PDF (solo si el frontend lo solicita)
        byte[] pdfBytes = Array.Empty<byte>();
        if (req.Pdf)
        {
            try 
            {
                pdfBytes = _pdfService.ConvertToPdf(archivo, extension);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "No se pudo generar el PDF de apoyo.");
            }
        }

        // Devolvemos JSON con los archivos en formato Base64 para que el frontend 
        // pueda descargarlos de forma independiente
        var responsePayload = new 
        {
            documentoOriginal = new 
            {
                nombre = nombreBase + extension,
                mimeType = extension == ".docx" 
                    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                base64 = Convert.ToBase64String(archivo)
            },
            documentoPdf = pdfBytes.Length > 0 ? new
            {
                nombre = nombreBase + ".pdf",
                mimeType = "application/pdf",
                base64 = Convert.ToBase64String(pdfBytes)
            } : null
        };

        return Ok(responsePayload);
    }
}
