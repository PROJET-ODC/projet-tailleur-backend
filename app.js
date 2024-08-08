import express from "express";
import "dotenv/config";
import dbConnection from "./config/db.js";
import { router as authRoutes } from "./routes/auth.js";
import { router as clientRoutes } from "./routes/client.js";
import { router as tailleurRoutes } from "./routes/tailleur.js";
import { createJWT } from './utils/jwt.js'; // Assurez-vous que createJWT est correctement exporté

// Connexion à la base de données
dbConnection();

const app = express();

const BASE_API = process.env.PREFIX_URI;
const PORT = process.env.PORT ; // Ajoutez une valeur par défaut si le PORT n'est pas défini dans le fichier .env

// Création du token avec l'ID du compte
const compteId = "66b370d4fb8bbc4b0425ef4d,tailleur";
const token = createJWT({ payload: { id: '1', role: 'tailleur' } });

// Affichage du token dans la console
console.log("Token généré :", token);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(`${BASE_API}`, authRoutes);
app.use(`${BASE_API}/client`, clientRoutes);
app.use(`${BASE_API}/tailleur`, tailleurRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});
