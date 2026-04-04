using Microsoft.AspNetCore.Identity;
using ExportadorDocumentos.Models;

namespace ExportadorDocumentos.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var logger = serviceProvider.GetRequiredService<ILogger<ApplicationUser>>();

        // Crear roles
        string[] roles = ["Admin", "Operador"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                logger.LogInformation("Rol '{Role}' creado.", role);
            }
        }

        // Crear usuario admin por defecto
        if (await userManager.FindByNameAsync("admin") == null)
        {
            var admin = new ApplicationUser
            {
                UserName = "admin",
                DisplayName = "Administrador"
            };

            var result = await userManager.CreateAsync(admin, "admin");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
                logger.LogInformation("Usuario admin creado correctamente.");
            }
            else
            {
                logger.LogError("Error al crear usuario admin: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        if (await userManager.FindByNameAsync("1143825584") == null)
        {
            var admin = new ApplicationUser
            {
                UserName = "1143825584",
                DisplayName = "Walter Urbano Admin"
            };

            var result = await userManager.CreateAsync(admin, "walterurbanoprueba");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
                logger.LogInformation("Usuario Walter Urbano creado correctamente.");
            }
            else
            {
                logger.LogError("Error al crear usuario Walter Urbano: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}
