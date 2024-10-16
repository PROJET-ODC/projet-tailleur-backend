# Utiliser une image Node.js comme base
FROM node:18

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste du code de l'application
COPY . .

# Exposer le port (Render fournit ce port via la variable d'environnement PORT)
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
