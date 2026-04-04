using System.Text.Json;

namespace ExportadorDocumentos.Services.Excel;

/// <summary>
/// Aplana objetos JSON anidados en un diccionario plano con claves dot-notation.
/// 
/// Ejemplo:
///   { "empresa": { "nombre": "X", "nit": "Y" } }
///   → { "empresa.nombre": "X", "empresa.nit": "Y" }
/// 
/// Arrays e imágenes (objetos con firma_base64) NO se aplanan,
/// se preservan tal cual para que DynamicListProcessor e ImageInjector los manejen.
/// </summary>
public static class JsonFlattener
{
    /// <summary>
    /// Aplana un diccionario JSON, expandiendo objetos anidados en claves dot-notation.
    /// </summary>
    public static Dictionary<string, JsonElement> Aplanar(Dictionary<string, JsonElement> datos)
    {
        var resultado = new Dictionary<string, JsonElement>();
        AplanarRecursivo(datos, "", resultado);
        return resultado;
    }

    private static void AplanarRecursivo(
        Dictionary<string, JsonElement> datos,
        string prefijo,
        Dictionary<string, JsonElement> resultado)
    {
        foreach (var kvp in datos)
        {
            string clave = string.IsNullOrEmpty(prefijo)
                ? kvp.Key
                : $"{prefijo}.{kvp.Key}";

            if (kvp.Value.ValueKind == JsonValueKind.Object)
            {
                // Si es imagen, preservar sin aplanar
                if (ImageInjector.EsImagen(kvp.Value))
                {
                    resultado[clave] = kvp.Value;
                    continue;
                }

                // Aplanar objeto recursivamente
                var subDatos = new Dictionary<string, JsonElement>();
                foreach (var prop in kvp.Value.EnumerateObject())
                {
                    subDatos[prop.Name] = prop.Value;
                }
                AplanarRecursivo(subDatos, clave, resultado);
            }
            else
            {
                // Escalares y arrays se preservan tal cual
                resultado[clave] = kvp.Value;
            }
        }
    }
}
