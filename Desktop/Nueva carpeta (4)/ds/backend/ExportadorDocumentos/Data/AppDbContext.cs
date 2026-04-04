using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ExportadorDocumentos.Models;

namespace ExportadorDocumentos.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}
