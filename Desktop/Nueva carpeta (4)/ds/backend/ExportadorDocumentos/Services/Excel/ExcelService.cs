using ClosedXML.Excel;
using System.Text.Json;

namespace ExportadorDocumentos.Services.Excel;

/// <summary>
/// Motor agnóstico de generación de documentos Excel.
/// Orquesta el pipeline: aplanar JSON → validar → expandir arrays → reemplazar escalares → inyectar imágenes → limpiar.
/// Soporta multi-hoja: si sheetName es null/vacío, procesa todas las hojas del workbook.
/// </summary>
public class ExcelService : IDocumentGenerator
{
    private readonly TemplateLoader _templateLoader;
    private readonly DynamicListProcessor _listProcessor;
    private readonly ImageInjector _imageInjector;
    private readonly ILogger<ExcelService> _logger;

    public ExcelService(
        TemplateLoader templateLoader,
        DynamicListProcessor listProcessor,
        ImageInjector imageInjector,
        ILogger<ExcelService> logger)
    {
        _templateLoader = templateLoader;
        _listProcessor = listProcessor;
        _imageInjector = imageInjector;
        _logger = logger;
    }

    /// <summary>
    /// Genera un documento Excel a partir de una plantilla y un JSON agnóstico.
    /// Si sheetName es null o vacío, procesa TODAS las hojas del workbook.
    /// Pipeline: aplanar → validar → arrays → escalares → imágenes → limpiar.
    /// </summary>
    public byte[] GenerarDesdeJson(
        string templateName,
        string? sheetName,
        Dictionary<string, JsonElement> datos)
    {
        using var workbook = _templateLoader.Cargar(templateName);

        // 0. Aplanar objetos anidados en claves dot-notation
        var datosAplanados = JsonFlattener.Aplanar(datos);

        // Clasificar datos aplanados por tipo
        var escalares = new Dictionary<string, JsonElement>();
        var arrays = new Dictionary<string, JsonElement>();
        var imagenes = new Dictionary<string, JsonElement>();

        foreach (var kvp in datosAplanados)
        {
            switch (kvp.Value.ValueKind)
            {
                case JsonValueKind.Array:
                    arrays[kvp.Key] = kvp.Value;
                    _logger.LogInformation("[Clasificación] Array: '{Key}' ({Count} items)",
                        kvp.Key, kvp.Value.GetArrayLength());
                    break;

                case JsonValueKind.Object when ImageInjector.EsImagen(kvp.Value):
                    imagenes[kvp.Key] = kvp.Value;
                    _logger.LogInformation("[Clasificación] Imagen: '{Key}'", kvp.Key);
                    break;

                case JsonValueKind.Object:
                    _logger.LogWarning("[Clasificación] Objeto no aplanado (ignorado): '{Key}'", kvp.Key);
                    break;

                default:
                    escalares[kvp.Key] = kvp.Value;
                    break;
            }
        }

        _logger.LogInformation("[Pipeline] Escalares: {E}, Arrays: {A}, Imágenes: {I}",
            escalares.Count, arrays.Count, imagenes.Count);

        // Determinar qué hojas procesar
        var hojas = ObtenerHojas(workbook, sheetName);

        foreach (var ws in hojas)
        {
            _logger.LogInformation("[Pipeline] Procesando hoja: '{Sheet}'", ws.Name);

            // 1. Validar plantilla vs JSON
            TemplateValidator.Validar(ws, datosAplanados, _logger);

            // 2. Primero arrays (insertan filas, deben ir antes de otros reemplazos)
            if (arrays.Count > 0)
                _listProcessor.Procesar(ws, arrays);

            // 3. Luego escalares
            foreach (var kvp in escalares)
            {
                string placeholder = $"{{{{{kvp.Key}}}}}";
                PlaceholderReplacer.Reemplazar(ws, placeholder, kvp.Value);
            }

            // 4. Luego imágenes
            foreach (var kvp in imagenes)
            {
                string placeholder = $"{{{{{kvp.Key}}}}}";
                _imageInjector.Inyectar(ws, placeholder, kvp.Value);
            }

            // 5. Limpieza final
            PlaceholderReplacer.LimpiarSobrantes(ws);
        }

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        return ms.ToArray();
    }

    /// <summary>
    /// Obtiene las hojas a procesar. Si sheetName es null/vacío, retorna todas.
    /// </summary>
    private List<IXLWorksheet> ObtenerHojas(XLWorkbook workbook, string? sheetName)
    {
        if (!string.IsNullOrWhiteSpace(sheetName))
        {
            return [workbook.Worksheet(sheetName)];
        }

        _logger.LogInformation("[Pipeline] Sin sheetName → procesando las {Count} hojas del workbook.",
            workbook.Worksheets.Count);

        return workbook.Worksheets.ToList();
    }
}
