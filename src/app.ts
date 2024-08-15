import express from "express";
import "dotenv/config";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";
import { router as authRoutes } from "./routes/auth.js";
import { router as clientRoutes } from "./routes/client.js";
import { router as tailleurRoutes } from "./routes/tailleur.js";
import { router as vendeurRoutes } from "./routes/vendeur.js";
import swaggerUi from "swagger-ui-express";
import yamljs from "yamljs";
import path from "path";
import { fileURLToPath } from 'url';


const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Recréer __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_API = process.env.PREFIX_URI;
// Load your YAML file
const swaggerDocument = yamljs.load(path.join(__dirname,"..", 'swagger.yaml'));

const PORT = process.env.PORT ; // Ajoutez une valeur par défaut si le PORT n'est pas défini dans le fichier .env

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
// Serve Swagger UI
app.use('/api-docs-tailleur', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(`${BASE_API}`, authRoutes);
app.use(`${BASE_API}/client`, clientRoutes);
app.use(`${BASE_API}/tailleur`, tailleurRoutes);
app.use(`${BASE_API}/vendeur`, vendeurRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



