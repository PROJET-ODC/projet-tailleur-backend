import express from "express";
import clientController from "../controller/ClientController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";
//
const router = express.Router();
//

router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes


router.route('/profile/posts/:id').get(clientController.getPostById);
router.route('/accueil/posts/:id').get(clientController.getPostById);

router.route('/profile').get(clientController.userProfile);

router.route('/follow').post(clientController.follow);

router.route('/bloquer').post(isAuthenticatedGlobal, clientController.bloquer);

router.route('/profile/:identifiant').get(clientController.getSomeProfile);

// Route pour le fil d'actualité
router.route('/accueil').get(clientController.getNewsFeed); // Route pour obtenir le fil d'actualité
// Route pour afficher le profil du client
// router.route('/posts/:id').get(clientController.getPostById);
router.route('/profile').get(clientController.userProfile);
// // Route pour la recherche de la page fil d'actualité
router.route('/accueil/search').post(clientController.accueilSearch);
//

export { router };
