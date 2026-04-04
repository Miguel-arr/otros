using ClosedXML.Excel;
using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ExportadorDocumentos.Services.Excel;

/// <summary>
/// Reemplaza placeholders {{llave}} por valores en celdas Excel.
/// Detecta tipos nativos (número, booleano) para preservar formato/fórmulas.
/// </summary>
public static partial class PlaceholderReplacer
{
    private static readonly Regex PlaceholderRegex = GeneratePlaceholderRegex();

    [GeneratedRegex(@"\{\{.*?\}\}", RegexOptions.Compiled)]
    private static partial Regex GeneratePlaceholderRegex();

    /// <summary>
    /// Reemplaza un placeholder en todas las celdas usadas de la hoja.
    /// Detecta si el valor es numérico o booleano para asignarlo nativamente.
    /// </summary>
    public static void Reemplazar(IXLWorksheet ws, string placeholder, JsonElement valor)
    {
        foreach (var cell in ws.CellsUsed())
        {
            var texto = cell.GetString();
            if (!texto.Contains(placeholder)) continue;

            bool esSoloPlaceholder = texto.Trim() == placeholder;

            if (esSoloPlaceholder)
                AsignarValorNativo(cell, valor);
            else
                cell.Value = texto.Replace(placeholder, ObtenerTexto(valor));
        }
    }

    /// <summary>
    /// Reemplaza un placeholder SOLO en una fila específica.
    /// Escanea todas las columnas del rango usado para detectar celdas merged/clonadas.
    /// </summary>
    public static void ReemplazarEnFila(IXLWorksheet ws, int fila, string placeholder, JsonElement valor)
    {
        var rangoUsado = ws.RangeUsed();
        if (rangoUsado == null) return;

        int lastCol = rangoUsado.LastColumn().ColumnNumber();
        for (int c = 1; c <= lastCol; c++)
        {
            var cell = ws.Cell(fila, c);
            var texto = cell.GetString();
            if (string.IsNullOrEmpty(texto) || !texto.Contains(placeholder)) continue;

            bool esSoloPlaceholder = texto.Trim() == placeholder;

            if (esSoloPlaceholder)
                AsignarValorNativo(cell, valor);
            else
                cell.Value = texto.Replace(placeholder, ObtenerTexto(valor));
        }
    }

    /// <summary>
    /// Limpia cualquier placeholder {{...}} sobrante que no haya sido reemplazado.
    /// </summary>
    public static void LimpiarSobrantes(IXLWorksheet ws)
    {
        foreach (var cell in ws.CellsUsed())
        {
            var texto = cell.GetString();
            if (PlaceholderRegex.IsMatch(texto))
            {
                var cleaned = PlaceholderRegex.Replace(texto, string.Empty).Trim();
                cell.Value = cleaned;
            }
        }
    }

    /// <summary>
    /// Asigna el valor nativo a la celda según el tipo JSON,
    /// preservando formato numérico/fecha del Excel.
    /// Orden de detección: número → booleano → fecha → texto.
    /// </summary>
    private static void AsignarValorNativo(IXLCell cell, JsonElement valor)
    {
        switch (valor.ValueKind)
        {
            case JsonValueKind.Number:
                cell.Value = valor.GetDouble();
                break;

            case JsonValueKind.True:
            case JsonValueKind.False:
                cell.Value = valor.GetBoolean();
                break;

            case JsonValueKind.Null:
                cell.Value = string.Empty;
                break;

            default:
                string text = valor.ToString();

                // 1. Intentar parsear como número
                if (double.TryParse(text, CultureInfo.InvariantCulture, out double num))
                {
                    cell.Value = num;
                    break;
                }

                // 2. Intentar parsear como fecha (ISO y formatos comunes)
                if (TryParseDate(text, out DateTime fecha))
                {
                    cell.Value = fecha;
                    // Si la celda no tiene formato de fecha, aplicar uno por defecto
                    if (!cell.Style.NumberFormat.Format.Contains('d') &&
                        !cell.Style.NumberFormat.Format.Contains('y'))
                    {
                        cell.Style.NumberFormat.Format = "yyyy-MM-dd";
                    }
                    break;
                }

                // 3. Asignar como texto
                cell.Value = text;
                break;
        }
    }

    /// <summary>
    /// Intenta parsear un string como fecha en múltiples formatos comunes.
    /// </summary>
    private static bool TryParseDate(string text, out DateTime result)
    {
        // Solo intentar si tiene longitud razonable para una fecha (8-20 chars)
        if (text.Length < 8 || text.Length > 20)
        {
            result = default;
            return false;
        }

        string[] formats =
        [
            "yyyy-MM-dd",           // ISO 8601
            "yyyy-MM-ddTHH:mm:ss",  // ISO con hora
            "dd/MM/yyyy",           // Formato latino
            "MM/dd/yyyy",           // Formato US
            "dd-MM-yyyy",
            "yyyy/MM/dd",
        ];

        return DateTime.TryParseExact(
            text, formats,
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out result);
    }

    private static string ObtenerTexto(JsonElement valor)
    {
        return valor.ValueKind == JsonValueKind.Null ? "" : valor.ToString();
    }
}
