using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExportadorDocumentos.Models
{
    public class InspeccionProgreso
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string Serie { get; set; } = string.Empty;

        [Required]
        public string Seccion { get; set; } = string.Empty; // Ej: "Eslinga", "TieOff"

        [Required]
        [Column(TypeName = "jsonb")]
        public string DatosJson { get; set; } = "{}";

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public DateTime FechaActualizacion { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public virtual ApplicationUser? User { get; set; }
    }
}
