using System.Text.Json;
using System.Text.RegularExpressions;
using ClosedXML.Excel;

namespace ExportadorDocumentos.Services.Excel;

/// <summary>
/// Valida la correspondencia entre placeholders en la plantilla y claves en el JSON.
/// Emite warnings (no errores) para ayudar a detectar typos o datos faltantes.
/// </summary>
public static partial class TemplateValidator
{
    [GeneratedRegex(@"\{\{(.*?)\}\}", RegexOptions.Compiled)]
    private static partial Regex PlaceholderRegex();

    /// <summary>
    /// Extrae todos los placeholders únicos de una hoja.
    /// </summary>
    public static HashSet<string> ExtraerPlaceholders(IXLWorksheet ws)
    {
        var placeholders = new HashSet<string>();
        var regex = PlaceholderRegex();

        foreach (var cell in ws.CellsUsed())
        {
            var matches = regex.Matches(cell.GetString());
            foreach (Match match in matches)
            {
                placeholders.Add(match.Groups[1].Value);
            }
        }

        return placeholders;
    }

    /// <summary>
    /// Valida y emite warnings sobre discrepancias.
    /// </summary>
    public static void Validar(
        IXLWorksheet ws,
        Dictionary<string, JsonElement> datosAplanados,
        ILogger logger)
    {
        var placeholdersEnPlantilla = ExtraerPlaceholders(ws);

        // Claves del JSON (sin los sub-keys de arrays, ya que esos se expanden dinámicamente)
        var clavesJson = new HashSet<string>();
        foreach (var kvp in datosAplanados)
        {
            clavesJson.Add(kvp.Key);

            // Si es array, agregar las sub-claves del primer item
            if (kvp.Value.ValueKind == JsonValueKind.Array)
            {
                var items = kvp.Value.EnumerateArray().ToList();
                if (items.Count > 0 && items[0].ValueKind == JsonValueKind.Object)
                {
                    foreach (var prop in items[0].EnumerateObject())
                    {
                        clavesJson.Add(prop.Name);
                    }
                }
            }
        }

        // Placeholders en la plantilla que no están en el JSON
        var sinDatos = placeholdersEnPlantilla.Except(clavesJson).ToList();
        if (sinDatos.Count > 0)
        {
            logger.LogWarning(
                "[Validación] Placeholders en plantilla sin datos en JSON ({Count}): {Placeholders}",
                sinDatos.Count, string.Join(", ", sinDatos));
        }

        // Claves en JSON que no tienen placeholder en la plantilla
        // (excluir arrays y objetos complejos, solo alertar sobre escalares)
        var sinPlaceholder = clavesJson
            .Where(k => !placeholdersEnPlantilla.Contains(k))
            .Where(k => datosAplanados.ContainsKey(k) &&
                        datosAplanados[k].ValueKind != JsonValueKind.Array &&
                        datosAplanados[k].ValueKind != JsonValueKind.Object)
            .ToList();

        if (sinPlaceholder.Count > 0)
        {
            logger.LogWarning(
                "[Validación] Claves en JSON sin placeholder en plantilla ({Count}): {Keys}",
                sinPlaceholder.Count, string.Join(", ", sinPlaceholder.Take(10)));
        }
    }
}
