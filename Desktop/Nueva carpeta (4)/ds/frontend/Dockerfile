# Etapa 1: Build de Node
FROM node:20-alpine AS build
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de configuración y dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Construir para producción
RUN pnpm run build

# Etapa 2: Nginx
FROM nginx:alpine

# Eliminar el default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nuestra configuración custom donde tenemos el proxy a /api
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
