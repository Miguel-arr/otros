using Microsoft.Extensions.DependencyInjection;
using System;
using ExportadorDocumentos.Services.Excel;
using ExportadorDocumentos.Services.Word;

namespace ExportadorDocumentos.Services;

public class DocumentGeneratorFactory
{
    private readonly IServiceProvider _serviceProvider;

    public DocumentGeneratorFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IDocumentGenerator GetGenerator(string templateName)
    {
        if (string.IsNullOrWhiteSpace(templateName))
            throw new ArgumentException("El nombre de la plantilla no puede estar vacío.");

        string extension = System.IO.Path.GetExtension(templateName).ToLowerInvariant();

        return extension switch
        {
            ".xlsx" => _serviceProvider.GetRequiredService<ExcelService>(),
            ".docx" => _serviceProvider.GetRequiredService<WordService>(),
            ".pdf"  => throw new NotSupportedException("Generación de PDF ya no está soportada (cambio a Word)."),
            _ => throw new NotSupportedException($"La extensión '{extension}' no es soportada por el motor.")
        };
    }
}
