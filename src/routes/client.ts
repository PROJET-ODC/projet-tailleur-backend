import express from "express";
import clientController from "../controller/ClientController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";
//
const router = express.Router();
//

router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes

// route pour enregistrer mesure
router.route("/share").post(clientController.ShareNb);

//Vue de posts
router.route("/view").post(clientController.ViewsNb);
// Faire une commande
router.route("/commandes").post(clientController.createCommande);

// Définir la route GET pour récupérer les notifications ///////////////////////
router.route("/notifications").get(clientController.getNotificationsForUser);
// Route pour ajouter un like ou un dislike// Route pour ajouter un like//////////////////////////////////////
router.route("/like").post(clientController.addLike);

router.route("/dislike").post(clientController.addDislike);

//send message
router.route("/sendMessage").post(clientController.sendMessage);
router.route("/messages/:user_id").get(clientController.getMesssage);

router.route("/favorites").get(clientController.getAllFavorites);
router.route("/favorites/add").post(clientController.addFavorite);
router.route("/favorites/delete").delete(clientController.deleteFavorite);

router.route("/compte/report").post(clientController.signaler);
// // Route pour obtenir tous les messages d'un client (utilisateur)
router
  .route("/posts/comment")
  .post(clientController.ajoutComment)
  .delete(clientController.deleteComment);

router
  .route("/posts/comment/reponse")
  .post(clientController.reponseComment)
  .delete(clientController.deleteResponseComment);
// //route pour attribuer note a un compte
router.route("/note").post(clientController.addNote);
router.route("/follow").post(clientController.follow);
router.route("/discussions").get(clientController.getDiscussionData);

router.route("/followers").get(clientController.getAllFollowers);

router.route("/bloquer").post(isAuthenticatedGlobal, clientController.bloquer);

router.route("/profile/:identifiant").get(clientController.getSomeProfile);

// Route pour le fil d'actualité
router.route("/accueil").get(clientController.getNewsFeed); // Route pour obtenir le fil d'actualité
router.route("/profile").get(clientController.userProfile);
// // Route pour la recherche de la page fil d'actualité
router.route("/accueil/search").post(clientController.accueilSearch);

router.route("/auth-user").get(clientController.getAuthUser);

router.route("/suggestion").get(clientController.getSuggestions);
router.route("/taille").get(clientController.getTaille);

export { router };
