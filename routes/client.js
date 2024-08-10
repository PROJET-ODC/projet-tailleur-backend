import express from "express";
import clientController from "../controller/ClientController.js";
import tailleurController from "../controller/TailleurController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes

// Route pour afficher le profil du client
router.get('/profile', clientController.showClientProfile);

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

router.route('/favorites').get(clientController.getAllFavorites);
router.route('/favorites/add').post(clientController.addFavorite);
router.route('/favorites/delete').delete(clientController.deleteFavorite);
router.route('/compte/report').patch(clientController.signaler);

// Route pour obtenir tous les messages d'un client (utilisateur)
router.route('/messages').get(clientController.getAllMessages).post(clientController.sendMessage);

// Route pour ajouter un like ou un dislike// Route pour ajouter un like
router.route('/like').post(clientController.addLike);

// Route pour ajouter un dislike
router.route('/dislike').post(clientController.addDislike);

// Route pour supprimer un like ou un dislike
router.route('/unlike').delete(clientController.removeLikeOrDislike);

router.route('/profile').get(clientController.userProfile);

router.route('/accueil/search').post(clientController.accueilSearch);
router.route('/posts/comment').post(clientController.ajoutComment).delete(clientController.deleteComment);
router.route('/posts/comment/reponse').post(clientController.reponseComment).delete(clientController.deleteResponseComment);

router.route('/follow').post(clientController.follow);

router.route('/profile/:identifiant').get(clientController.getSomeProfile);

export { router };

