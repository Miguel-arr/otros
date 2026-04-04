namespace ExportadorDocumentos.Services;

public interface IJwtService
{
    string GenerarToken(string username, string displayName);
}
