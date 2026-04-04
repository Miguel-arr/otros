using System.Text.Json;

namespace ExportadorDocumentos.Services;

public interface IDocumentGenerator
{
    byte[] GenerarDesdeJson(string templateName, string? sheetName, Dictionary<string, JsonElement> datos);
}
