# Etapa de compilación
FROM node:20-alpine AS buildstage

# Crear directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --ignore-scripts

# Copiar el resto del código fuente necesario para el build
COPY src ./src
COPY angular.json ./
COPY tsconfig*.json ./

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Crear un usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar los archivos del build desde la etapa anterior
COPY --from=buildstage /app/dist/skinsmask-frontend /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cambiar al usuario no root
USER appuser

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
