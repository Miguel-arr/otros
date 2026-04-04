using System.ComponentModel.DataAnnotations;

namespace ExportadorDocumentos.Models;

public class LoginRequest
{
    [Required(ErrorMessage = "El usuario es requerido.")]
    [StringLength(50, ErrorMessage = "El usuario no puede exceder 50 caracteres.")]
    public required string Username { get; set; }

    [Required(ErrorMessage = "La contraseña es requerida.")]
    [StringLength(100, ErrorMessage = "La contraseña no puede exceder 100 caracteres.")]
    public required string Password { get; set; }
}
