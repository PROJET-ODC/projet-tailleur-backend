import express from "express";
import clientController from "../controller/ClientController.js";
import tailleurController from "../controller/TailleurController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes

// Route pour le fil d'actualité
router.route('/accueil')
    .get(clientController.getNewsFeed); // Route pour obtenir le fil d'actualité

// Routes pour les posts
 router.route('/posts')
    .get(tailleurController.listMyAllPosts)
    .post(tailleurController.createPost);
 

// Routes pour les statuts
router.route('/status')
    .get(clientController.listStatus);

// Routes pour les messages

// Routes pour les notifications
router.route('/notifications/:id')
    .get(clientController.getNotificationById); // Cette méthode devrait afficher la page de la notification
// Routes pour les favoris des posts
router.route('/messages/:id')
    .get(clientController.getMessageById); // Cette méthode devrait afficher la page du message

// Route pour accéder aux favoris par ID
router.route('/favorites/:id')
    .get(clientController.getFavoriteById); // Cette méthode devrait afficher la page du favori

// Route pour créer un compte
router.route('/compte')
    .post(clientController.createAccount);

router.route('/compte')
    .get(clientController.getAccount);


export { router };
