using Microsoft.OpenApi.Models;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ExportadorDocumentos.Data;
using ExportadorDocumentos.Models;
using ExportadorDocumentos.Services;
using ExportadorDocumentos.Middleware;

// Cargar variables de entorno desde archivo .env
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// =============================
// Servicios
// =============================
builder.Services.AddControllers();

// PostgreSQL + EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection no está configurado. Revisa tu archivo .env")));

// ASP.NET Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Requisitos de contraseña flexibles para desarrollo
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 4;

    // Bloqueo por intentos fallidos
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Registrar servicios de negocio
builder.Services.AddScoped<ExportadorDocumentos.Services.Excel.TemplateLoader>();
builder.Services.AddScoped<ExportadorDocumentos.Services.Excel.ImageInjector>();
builder.Services.AddScoped<ExportadorDocumentos.Services.Excel.DynamicListProcessor>();
builder.Services.AddScoped<ExportadorDocumentos.Services.IDocumentGenerator, ExportadorDocumentos.Services.Excel.ExcelService>();
builder.Services.AddScoped<ExportadorDocumentos.Services.Excel.ExcelService>();
builder.Services.AddScoped<ExportadorDocumentos.Services.Word.WordService>();
builder.Services.AddScoped<ExportadorDocumentos.Services.DocumentGeneratorFactory>();
builder.Services.AddScoped<ExportadorDocumentos.Services.PdfService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// CORS - Orígenes específicos desde configuración
var allowedOrigins = builder.Configuration["CORS:AllowedOrigins"]?.Split(",")
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT Authentication - Lee el token desde cookie HttpOnly
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var secretKey = builder.Configuration["JWT:SecretKey"]
        ?? throw new InvalidOperationException("JWT:SecretKey no está configurado. Revisa tu archivo .env");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ClockSkew = TimeSpan.Zero
    };

    // Leer JWT desde cookie HttpOnly en lugar del header Authorization
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["jwt"];
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("login", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
    options.RejectionStatusCode = 429;
});


// Swagger con soporte para Cookie Auth
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Exportador Documentos API - GD Ingeniería S.A.S",
        Version = "v1",
        Description = "Motor de automatización agnóstico para generación de documentos Excel."
    });

    options.AddSecurityDefinition("cookieAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Cookie,
        Name = "jwt",
        Description = "JWT token en cookie HttpOnly"
    });
});

var app = builder.Build();

// =============================
// Seed de Base de Datos
// =============================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await SeedData.InitializeAsync(scope.ServiceProvider);
}

// =============================
// Middleware Pipeline
// =============================
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

// CORS debe ir antes de Authentication/Authorization
app.UseCors();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
