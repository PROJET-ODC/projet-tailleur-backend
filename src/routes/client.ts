import express from "express";
import clientController from "../controller/ClientController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";
//
const router = express.Router();
//

router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes

// route pour enregistrer mesure
router.route('/share').post(clientController.ShareNb);

//Vue de posts
router.route('/view').post(clientController.ViewsNb);
// Faire une commande
router.route('/commandes').post(clientController.createCommande);


export { router };
