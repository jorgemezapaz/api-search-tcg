# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto que usa la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "app.js"]