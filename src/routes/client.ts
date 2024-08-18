import express from "express";
import clientController from "../controller/ClientController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";
//
const router = express.Router();
//

router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes

// Route pour le fil d'actualité
router.route('/accueil').get(clientController.getNewsFeed); // Route pour obtenir le fil d'actualité
// Route pour afficher le profil du client
// router.route('/posts/:id').get(clientController.getPostById);
router.route('/profile').get(clientController.userProfile);
// // Route pour la recherche de la page fil d'actualité
// router.route('/accueil/search').post(clientController.accueilSearch);
//

export { router };
