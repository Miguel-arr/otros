using ClosedXML.Excel;

namespace ExportadorDocumentos.Services.Excel;

/// <summary>
/// Carga plantillas Excel de forma segura.
/// Sanitiza el nombre contra Path Traversal y abre en modo ReadOnly
/// para permitir acceso concurrente.
/// </summary>
public class TemplateLoader
{
    private readonly string _templatesDir;

    public TemplateLoader(IWebHostEnvironment env)
    {
        _templatesDir = Path.GetFullPath(Path.Combine(env.ContentRootPath, "Templates"));
    }

    /// <summary>
    /// Carga una plantilla Excel en modo ReadOnly.
    /// </summary>
    /// <param name="templateName">Nombre del archivo (ej: "ALTURAS.xlsx")</param>
    /// <returns>XLWorkbook abierto en modo lectura.</returns>
    public XLWorkbook Cargar(string templateName)
    {
        string safeName = Path.GetFileName(templateName);
        string templatePath = Path.Combine(_templatesDir, safeName);
        string fullPath = Path.GetFullPath(templatePath);

        if (!fullPath.StartsWith(_templatesDir))
            throw new UnauthorizedAccessException("Acceso denegado a ruta fuera de Templates.");

        if (!File.Exists(templatePath))
            throw new FileNotFoundException($"Plantilla '{safeName}' no encontrada en Templates/");

        var stream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return new XLWorkbook(stream);
    }
}
