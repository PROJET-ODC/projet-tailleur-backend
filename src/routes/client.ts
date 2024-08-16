import express from "express";
// import clientController from "../controller/ClientController.js";
// import tailleurController from "../controller/TailleurController.js";
// import { isAuthenticatedGlobal } from "../middleware/auth.js";
// import { isClientAuthenticated } from "../middleware/authClient.js";
//
const router = express.Router();
//
//
// router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes
//
// // Route pour le fil d'actualité
// router.route('/accueil')
//     .get(clientController.getNewsFeed); // Route pour obtenir le fil d'actualité
//
// // Routes pour les posts
//
// // router.route('/posts')
// //     .get(tailleurController.listMyAllPosts)
// //     .post(tailleurController.createPost);
//
// // router.route('/posts/:id')
// //     .get(tailleurController.listMyAllPosts)
// //     .post(tailleurController.createPost);
//
// // Définir la route GET pour récupérer les notifications
// router.route('/notifications').get(clientController.getNotificationsForUser);
//
// router.route('/measures').get(clientController.getClientMeasures.bind(clientController)).post(clientController.addMeasure);;
//
// // Route pour afficher le profil du client
// router.route('/profile').get(clientController.showClientProfile);
//
// router.route('/profile/posts/:id').get(clientController.getPostById);
// router.route('/accueil/posts/:id').get(clientController.getPostById);
//
// router.route('/profile').get(clientController.userProfile);
//
// // Routes pour les messages
// // Routes pour les notifications
// router.route('/notifications/:id').get(clientController.getNotificationById); // Cette méthode devrait afficher la page de la notification
// // Routes pour les favoris des posts
// router.route('/messages/:id').get(clientController.getMessageById); // Cette méthode devrait afficher la page du message
// // Route pour accéder aux favoris par ID
// router.route('/favorites/:id').get(clientController.getFavoriteById); // Cette méthode devrait afficher la page du favori
// // Route pour créer un compte
//
// router.route('/compte')
//     .post(clientController.createAccount);
//
// router.route('/compte')
//     .get(clientController.getAccount);
//
// router.route('/favorites').get(clientController.getAllFavorites);
//
//
//
//
// router.route('/favorites/add').post(clientController.addFavorite);
//
// router.route('/favorites/delete').delete(clientController.deleteFavorite);
//
// router.route('/compte/report').post(clientController.signaler);
//
// // Route pour obtenir tous les messages d'un client (utilisateur)
// router.route('/messages').get(clientController.getAllMessages).post(clientController.sendMessage);
//
// // Route pour ajouter un like ou un dislike// Route pour ajouter un like
// router.route('/like').post(clientController.addLike);
//
// // Route pour ajouter un dislike
// router.route('/dislike').post(clientController.addDislike);
//
//
//
//
//
//
// // Route pour supprimer un like ou un dislike
// router.route('/unlike').delete(clientController.removeLikeOrDislike);
//
// router.route('/accueil/search').post(clientController.accueilSearch);
//
// router.route('/posts/comment').post(clientController.ajoutComment);
//
// router.route('/posts/comment/reponse').post(clientController.reponseComment).delete(clientController.deleteResponseComment);
//
// //route pour attribuer note a un compte
// router.route('/note').post(clientController.addNote);
//
// // route pour enregistrer mesure
// router.route('/share').post(clientController.ShareNb);
// router.route('/view').post(clientController.ViewsNb);
// router.route('/commandes').post(clientController.createCommande);
//
// router.route('/follow').post(clientController.follow);
//
// router.route('/bloquer').post(isAuthenticatedGlobal, clientController.bloquer);
//
// router.route('/profile/:identifiant').get(clientController.getSomeProfile);
//
export { router };
