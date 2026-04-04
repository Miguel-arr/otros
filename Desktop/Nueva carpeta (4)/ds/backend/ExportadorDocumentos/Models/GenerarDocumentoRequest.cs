using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace ExportadorDocumentos.Models;

/// <summary>
/// Contrato del motor agnóstico.
/// Plantilla y Hoja identifican el archivo Excel.
/// Datos es un JSON libre: cualquier llave coincide con {{llave}} en el Excel.
/// </summary>
public class GenerarDocumentoRequest
{
    [Required(ErrorMessage = "El campo 'plantilla' es requerido.")]
    public required string Plantilla { get; set; }

    /// <summary>
    /// Hoja del Excel a procesar. Si es null o vacío, se procesan TODAS las hojas.
    /// </summary>
    public string? Hoja { get; set; }

    [Required(ErrorMessage = "El campo 'datos' es requerido.")]
    public required Dictionary<string, JsonElement> Datos { get; set; }

    /// <summary>
    /// Indica si se debe generar el PDF de apoyo vía Gotenberg. Default: true.
    /// </summary>
    public bool Pdf { get; set; } = true;
}
