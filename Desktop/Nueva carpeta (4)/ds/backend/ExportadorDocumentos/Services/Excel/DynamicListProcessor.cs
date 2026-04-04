using ClosedXML.Excel;
using System.Text.Json;

namespace ExportadorDocumentos.Services.Excel;

/// <summary>
/// Procesa arrays JSON expandiéndolos en filas clonadas de la plantilla Excel.
///
/// Algoritmo:
/// 1. Para cada array, toma items[0] y su primera propiedad.
/// 2. Busca {{propiedad}} en la hoja → identifica la fila semilla.
/// 3. Clona la fila semilla N-1 veces (copiando contenido y formato).
/// 4. Reemplaza los sub-placeholders FILA POR FILA con los datos del item correspondiente.
/// 5. Si hay múltiples arrays, los procesa de abajo hacia arriba para no desplazar filas.
/// </summary>
public class DynamicListProcessor
{
    private readonly ImageInjector _imageInjector;
    private readonly ILogger<DynamicListProcessor> _logger;

    public DynamicListProcessor(ImageInjector imageInjector, ILogger<DynamicListProcessor> logger)
    {
        _imageInjector = imageInjector;
        _logger = logger;
    }

    /// <summary>
    /// Información de un array pendiente de procesar, con su fila semilla identificada.
    /// </summary>
    private record ArrayInfo(int FilaSemilla, List<JsonElement> Items);

    /// <summary>
    /// Procesa todos los arrays: identifica filas semilla, las ordena bottom→top,
    /// y expande cada array clonando la fila semilla.
    /// </summary>
    public void Procesar(IXLWorksheet ws, Dictionary<string, JsonElement> arrays)
    {
        // 1. Identificar la fila semilla de cada array
        var arrayInfos = new List<ArrayInfo>();

        foreach (var kvp in arrays)
        {
            var items = kvp.Value.EnumerateArray().ToList();
            if (items.Count == 0) continue;

            var primerItem = items[0];
            if (primerItem.ValueKind != JsonValueKind.Object) continue;

            int? filaSemilla = EncontrarFilaSemilla(ws, primerItem);
            if (filaSemilla == null)
            {
                _logger.LogWarning("No se encontró fila semilla para el array '{Array}'.", kvp.Key);
                continue;
            }

            arrayInfos.Add(new ArrayInfo(filaSemilla.Value, items));
        }

        // 2. Ordenar de abajo hacia arriba para que las inserciones no desplacen otras filas
        arrayInfos.Sort((a, b) => b.FilaSemilla.CompareTo(a.FilaSemilla));

        // 3. Procesar cada array
        foreach (var info in arrayInfos)
        {
            ExpandirArray(ws, info.FilaSemilla, info.Items);
        }
    }

    /// <summary>
    /// Encuentra la fila semilla buscando el primer sub-placeholder del primer item.
    /// </summary>
    private static int? EncontrarFilaSemilla(IXLWorksheet ws, JsonElement primerItem)
    {
        // Tomar la primera propiedad del primer item
        using var enumerator = primerItem.EnumerateObject().GetEnumerator();
        if (!enumerator.MoveNext()) return null;

        string primerPlaceholder = $"{{{{{enumerator.Current.Name}}}}}";

        // Buscar ese placeholder en la hoja
        foreach (var cell in ws.CellsUsed())
        {
            if (cell.GetString().Contains(primerPlaceholder))
                return cell.Address.RowNumber;
        }

        return null;
    }

    /// <summary>
    /// Expande un array: clona la fila semilla N-1 veces y reemplaza fila por fila.
    /// </summary>
    private void ExpandirArray(IXLWorksheet ws, int filaSemilla, List<JsonElement> items)
    {
        if (items.Count == 0)
        {
            ws.Row(filaSemilla).Clear();
            return;
        }

        // Clonar la fila semilla N-1 veces
        if (items.Count > 1)
        {
            int filasAInsertar = items.Count - 1;
            ws.Row(filaSemilla).InsertRowsBelow(filasAInsertar);

            // Identificar rangos combinados que estén contenidos en la fila semilla
            var mergedRangesFilaSemilla = ws.MergedRanges
                .Where(r => r.RangeAddress.FirstAddress.RowNumber == filaSemilla && 
                            r.RangeAddress.LastAddress.RowNumber == filaSemilla)
                .ToList();

            // Copiar contenido y formato de la semilla a cada fila nueva
            var filaSemillaRow = ws.Row(filaSemilla);
            for (int i = 1; i <= filasAInsertar; i++)
            {
                int filaDestino = filaSemilla + i;
                CopiarContenidoFila(ws, filaSemillaRow, filaDestino);

                // Aplicar las mismas combinaciones de celdas a la fila nueva
                foreach (var mr in mergedRangesFilaSemilla)
                {
                    int firstCol = mr.RangeAddress.FirstAddress.ColumnNumber;
                    int lastCol = mr.RangeAddress.LastAddress.ColumnNumber;
                    ws.Range(filaDestino, firstCol, filaDestino, lastCol).Merge();
                }
            }
        }

        // Reemplazar fila por fila
        for (int i = 0; i < items.Count; i++)
        {
            int filaActual = filaSemilla + i;
            var item = items[i];

            if (item.ValueKind != JsonValueKind.Object) continue;

            foreach (var prop in item.EnumerateObject())
            {
                string placeholder = $"{{{{{prop.Name}}}}}";

                if (ImageInjector.EsImagen(prop.Value))
                {
                    _imageInjector.InyectarEnFila(ws, filaActual, placeholder, prop.Value);
                }
                else
                {
                    PlaceholderReplacer.ReemplazarEnFila(ws, filaActual, placeholder, prop.Value);
                }
            }
        }
    }

    /// <summary>
    /// Copia el contenido y formato de cada celda de la fila fuente a la fila destino.
    /// </summary>
    private static void CopiarContenidoFila(IXLWorksheet ws, IXLRow fuente, int filaDestino)
    {
        // Copiar el alto de la fila (fundamental para que las firmas no se espichen)
        ws.Row(filaDestino).Height = fuente.Height;

        foreach (var cellFuente in fuente.CellsUsed())
        {
            int col = cellFuente.Address.ColumnNumber;
            var cellDestino = ws.Cell(filaDestino, col);

            // Copiar valor
            cellDestino.Value = cellFuente.Value;

            // Copiar estilo (fuente, bordes, colores, alineación)
            cellDestino.Style = cellFuente.Style;
        }
    }
}
