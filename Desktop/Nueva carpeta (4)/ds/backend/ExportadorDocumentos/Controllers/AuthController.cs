using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using ExportadorDocumentos.Models;
using ExportadorDocumentos.Services;

namespace ExportadorDocumentos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IJwtService jwtService,
        IConfiguration config,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _config = config;
        _logger = logger;
    }

    /// <summary>
    /// Autentica al usuario y setea un JWT en cookie HttpOnly.
    /// </summary>
    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _userManager.FindByNameAsync(req.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, req.Password))
        {
            _logger.LogWarning("Intento de login fallido para usuario: {Username}", req.Username);
            return Unauthorized(new { message = "Credenciales incorrectas." });
        }

        var token = _jwtService.GenerarToken(user.UserName!, user.DisplayName);
        var isDev = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        Response.Cookies.Append("jwt", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = !isDev,
            SameSite = isDev ? SameSiteMode.Lax : SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddHours(
                int.Parse(_config["JWT:ExpirationHours"] ?? "1")),
            Path = "/"
        });

        _logger.LogInformation("Login exitoso: {Username}", user.UserName);

        return Ok(new
        {
            message = "Autenticación exitosa.",
            username = user.UserName,
            displayName = user.DisplayName
        });
    }

    /// <summary>
    /// Cierra la sesión eliminando la cookie JWT.
    /// </summary>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt", new CookieOptions { Path = "/" });
        return Ok(new { message = "Sesión cerrada correctamente." });
    }

    /// <summary>
    /// Verifica si la sesión JWT sigue activa.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var username = User.Identity?.Name ?? "";
        var displayName = User.FindFirst("displayName")?.Value ?? "";
        return Ok(new { username, displayName });
    }
}
