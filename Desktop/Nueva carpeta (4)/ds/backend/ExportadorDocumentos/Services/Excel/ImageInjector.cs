using ClosedXML.Excel;
using System.Text.Json;

namespace ExportadorDocumentos.Services.Excel;

/// <summary>
/// Inyecta imágenes Base64 en celdas Excel.
/// Soporta tamaño configurable vía JSON: { "firma_base64": "...", "ancho": 200, "alto": 80 }
/// </summary>
public class ImageInjector
{
    private readonly ILogger<ImageInjector> _logger;

    private const int MaxImageBytes = 512_000; // 500KB

    public ImageInjector(ILogger<ImageInjector> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Determina si un JsonElement es una imagen (objeto con "firma_base64").
    /// </summary>
    public static bool EsImagen(JsonElement element)
    {
        if (element.ValueKind != JsonValueKind.Object) return false;
        
        // Detectar por marcador explícito o por propiedades conocidas de base64
        return element.TryGetProperty("isImageInfo", out _) || 
               element.TryGetProperty("firma_base64", out _) || 
               element.TryGetProperty("imageBase64", out _);
    }

    /// <summary>
    /// Busca el placeholder en toda la hoja e inyecta la imagen.
    /// </summary>
    public void Inyectar(IXLWorksheet ws, string placeholder, JsonElement imagenData)
    {
        var targetCell = BuscarCeldaEnHoja(ws, placeholder);
        if (targetCell == null)
        {
            _logger.LogWarning("Imagen: No se encontró placeholder '{Placeholder}' en la hoja.", placeholder);
            return;
        }

        _logger.LogInformation("Imagen: Inyectando en {Cell} para placeholder '{Placeholder}'.", targetCell.Address, placeholder);
        InyectarEnCelda(ws, targetCell, imagenData);
    }

    /// <summary>
    /// Busca el placeholder SOLO en una fila específica e inyecta la imagen.
    /// Escanea TODAS las celdas del rango usado (no solo CellsUsed) para
    /// detectar placeholders en celdas combinadas o clonadas.
    /// </summary>
    public void InyectarEnFila(IXLWorksheet ws, int fila, string placeholder, JsonElement imagenData)
    {
        var targetCell = BuscarCeldaEnFila(ws, fila, placeholder);
        if (targetCell == null)
        {
            _logger.LogWarning("Imagen: No se encontró placeholder '{Placeholder}' en fila {Fila}.", placeholder, fila);
            return;
        }

        _logger.LogInformation("Imagen: Inyectando en {Cell} fila {Fila} para '{Placeholder}'.", targetCell.Address, fila, placeholder);
        InyectarEnCelda(ws, targetCell, imagenData);
    }

    private void InyectarEnCelda(IXLWorksheet ws, IXLCell cell, JsonElement imagenData)
    {
        string base64 = "";
        if (imagenData.TryGetProperty("imageBase64", out var propB64)) 
            base64 = propB64.GetString() ?? "";
        else if (imagenData.TryGetProperty("firma_base64", out var propFirma))
            base64 = propFirma.GetString() ?? "";
            
        if (string.IsNullOrWhiteSpace(base64))
        {
            _logger.LogWarning("Imagen: firma_base64 vacío en celda {Cell}.", cell.Address);
            return;
        }

        string base64Data = base64.Contains(',') ? base64.Split(',')[1] : base64;

        try
        {
            byte[] imageBytes = Convert.FromBase64String(base64Data);

            if (imageBytes.Length > MaxImageBytes)
            {
                _logger.LogWarning("Imagen excede el tamaño máximo ({Max}KB).", MaxImageBytes / 1024);
                cell.Value = string.Empty;
                return;
            }

            using var ms = new MemoryStream(imageBytes);
            int row = cell.Address.RowNumber;
            int col = cell.Address.ColumnNumber;

            cell.Value = string.Empty;

            // Determinar los límites de la celda (o rango combinado)
            int firstRow = row, lastRow = row;
            int firstCol = col, lastCol = col;

            var mergedRange = ws.MergedRanges
                .FirstOrDefault(r =>
                    r.RangeAddress.FirstAddress.RowNumber <= row &&
                    r.RangeAddress.LastAddress.RowNumber >= row &&
                    r.RangeAddress.FirstAddress.ColumnNumber <= col &&
                    r.RangeAddress.LastAddress.ColumnNumber >= col);

            if (mergedRange != null)
            {
                firstRow = mergedRange.RangeAddress.FirstAddress.RowNumber;
                lastRow = mergedRange.RangeAddress.LastAddress.RowNumber;
                firstCol = mergedRange.RangeAddress.FirstAddress.ColumnNumber;
                lastCol = mergedRange.RangeAddress.LastAddress.ColumnNumber;
            }

            // Asegurar que el ALTO TOTAL del rango de la celda donde va la firma sea de al menos 40pt
            const double MinTotalHeight = 40.0;
            double currentTotalHeight = 0;
            for (int r = firstRow; r <= lastRow; r++)
            {
                currentTotalHeight += ws.Row(r).Height;
            }

            if (currentTotalHeight < MinTotalHeight)
            {
                // Si entre todas las filas sumadas no alcanzan 40pt (ej. una sola flaquita), expandimos equitativamente.
                double heightToExpand = (MinTotalHeight - currentTotalHeight) / (lastRow - firstRow + 1);
                for (int r = firstRow; r <= lastRow; r++)
                {
                    ws.Row(r).Height += heightToExpand;
                }
            }

            var picture = ws.AddPicture(ms);
            
            // Calculate cell region size in pixels
            double cellWidthPx = 0;
            for (int c = firstCol; c <= lastCol; c++)
                cellWidthPx += ws.Column(c).Width * 7.5; // Aproximación ancho excel a px

            double cellHeightPx = 0;
            for (int r = firstRow; r <= lastRow; r++)
                cellHeightPx += ws.Row(r).Height * (96.0 / 72.0); // Pts -> Px

            // Restar un padding (por ej. 4px por lado total 8px)
            cellWidthPx -= 8;
            cellHeightPx -= 8;

            if (cellWidthPx <= 0) cellWidthPx = 1;
            if (cellHeightPx <= 0) cellHeightPx = 1;

            double origW = picture.OriginalWidth;
            double origH = picture.OriginalHeight;

            if (origW <= 0) origW = 1;
            if (origH <= 0) origH = 1;

            double scale = Math.Min(cellWidthPx / origW, cellHeightPx / origH);
            
            // CRÍTICO: Si el factor de escala es mayor a 1 (la celda es gigantesca para la firma pequeña)
            // limitamos al 100% (1.0). Y además aplicamos un factor de seguridad (0.85) para la firma
            // del facilitar así nunca crecerá forzadamente sintiéndose desproporcionada ni tocará bordes.
            if (scale > 1.0) scale = 1.0;
            
            // Reducir la firma ligeramente para que 'respire' y no se incruste contra el borde 	
            scale *= 0.85;

            var fromCell = ws.Cell(firstRow, firstCol);
            picture.MoveTo(fromCell, 4, 4);
            
            // Preservar la relación de aspecto escalando a partir del ancho/alto original
            picture.Width = (int)(origW * scale);
            picture.Height = (int)(origH * scale);

            _logger.LogInformation(
                "Imagen inyectada en {From} (anclaje punto único, escala {Scale:F2}, {Size}KB).",
                fromCell.Address, scale, imageBytes.Length / 1024);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error al inyectar imagen en celda {Cell}.", cell.Address);
            cell.Value = string.Empty;
        }
    }

    /// <summary>
    /// Busca un placeholder en toda la hoja, incluyendo celdas dentro de rangos combinados.
    /// </summary>
    private static IXLCell? BuscarCeldaEnHoja(IXLWorksheet ws, string placeholder)
    {
        // Primero intentar con CellsUsed (rápido)
        foreach (var cell in ws.CellsUsed())
        {
            if (cell.GetString().Contains(placeholder))
                return cell;
        }

        // Si no se encuentra, buscar en todo el rango usado celda por celda
        // (necesario para celdas merged donde sólo la primera celda tiene valor)
        var rangoUsado = ws.RangeUsed();
        if (rangoUsado == null) return null;

        int lastRow = rangoUsado.LastRow().RowNumber();
        int lastCol = rangoUsado.LastColumn().ColumnNumber();
        for (int r = 1; r <= lastRow; r++)
        {
            for (int c = 1; c <= lastCol; c++)
            {
                var cell = ws.Cell(r, c);
                var texto = cell.GetString();
                if (!string.IsNullOrEmpty(texto) && texto.Contains(placeholder))
                    return cell;
            }
        }

        return null;
    }

    /// <summary>
    /// Busca un placeholder en una fila específica escaneando todas las columnas
    /// del rango usado (no solo CellsUsed, ya que celdas merged/clonadas pueden no aparecer).
    /// </summary>
    private static IXLCell? BuscarCeldaEnFila(IXLWorksheet ws, int fila, string placeholder)
    {
        var rangoUsado = ws.RangeUsed();
        if (rangoUsado == null) return null;

        int lastCol = rangoUsado.LastColumn().ColumnNumber();
        for (int c = 1; c <= lastCol; c++)
        {
            var cell = ws.Cell(fila, c);
            var texto = cell.GetString();
            if (!string.IsNullOrEmpty(texto) && texto.Contains(placeholder))
                return cell;
        }

        return null;
    }
}
