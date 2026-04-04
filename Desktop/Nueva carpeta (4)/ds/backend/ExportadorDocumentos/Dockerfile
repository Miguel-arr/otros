FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el archivo de proyecto y restaurar dependencias
COPY ["ExportadorDocumentos.csproj", "./"]
RUN dotnet restore "./ExportadorDocumentos.csproj"

# Copiar el resto del código y compilar
COPY . .
RUN dotnet build "ExportadorDocumentos.csproj" -c Release -o /app/build
RUN dotnet publish "ExportadorDocumentos.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Construir la imagen de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Asegurar que se copian las plantillas al directorio /app/Templates
COPY --from=build /src/Templates ./Templates

# Exponer puerto 80 o el puerto por defecto de ASP.NET 8 (que es 8080 en las imagenes linux)
EXPOSE 8080

ENTRYPOINT ["dotnet", "ExportadorDocumentos.dll"]
