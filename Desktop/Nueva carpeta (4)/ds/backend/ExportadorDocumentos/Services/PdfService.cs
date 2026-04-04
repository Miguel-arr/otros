using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace ExportadorDocumentos.Services;

public class PdfService
{
    private readonly ILogger<PdfService> _logger;
    private readonly string _gotenbergUrl;

    public PdfService(ILogger<PdfService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _gotenbergUrl = configuration["Gotenberg:Url"] ?? "http://localhost:3000";
    }

    public byte[] ConvertToPdf(byte[] documentBytes, string extension)
    {
        // Dado que puede haber temas async/await en el controlador sincronico 
        // lo esperaremos sincrónicamente ya que el controller es sincrónico actualmente
        return ConvertToPdfAsync(documentBytes, extension).GetAwaiter().GetResult();
    }

    public async Task<byte[]> ConvertToPdfAsync(byte[] documentBytes, string extension)
    {
        try
        {
            _logger.LogInformation("Enviando documento a Gotenberg para su conversión a PDF. Extensión original: {Extension}", extension);

            using var client = new HttpClient();
            using var request = new HttpRequestMessage(HttpMethod.Post, $"{_gotenbergUrl}/forms/libreoffice/convert");
            
            using var content = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(documentBytes);
            
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");
            
            // Gotenberg detecta el formato basándose en la extensión
            content.Add(fileContent, "files", "document" + extension);

            request.Content = content;

            using var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorTxt = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error de Gotenberg: HTTP {StatusCode} - {Error}", response.StatusCode, errorTxt);
                throw new InvalidOperationException("Falló la conversión a PDF por parte de Gotenberg.");
            }

            _logger.LogInformation("Conversión a PDF exitosa vía Gotenberg.");
            return await response.Content.ReadAsByteArrayAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Excepción crítica conectando a Gotenberg.");
            throw;
        }
    }
}
