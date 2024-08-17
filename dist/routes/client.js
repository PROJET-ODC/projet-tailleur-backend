import express from "express";
import clientController from "../controller/ClientController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";
const router = express.Router();
router.use(isAuthenticatedGlobal);
router.route('/accueil')
    .get(clientController.getNewsFeed);
router.route('/notifications').get(clientController.getNotificationsForUser);
router.route('/measures').get(clientController.getClientMeasures.bind(clientController)).post(clientController.addMeasure);
router.route('/profile').get(clientController.showClientProfile);
router.route('/profile/posts/:id').get(clientController.getPostById);
router.route('/accueil/posts/:id').get(clientController.getPostById);
router.route('/profile').get(clientController.userProfile);
router.route('/notifications/:id').get(clientController.getNotificationById);
router.route('/messages/:id').get(clientController.getMessageById);
router.route('/favorites/:id').get(clientController.getFavoriteById);
router.route('/compte')
    .post(clientController.createAccount);
router.route('/compte')
    .get(clientController.getAccount);
router.route('/favorites').get(clientController.getAllFavorites);
router.route('/favorites/add').post(clientController.addFavorite);
router.route('/favorites/delete').delete(clientController.deleteFavorite);
router.route('/compte/report').post(clientController.signaler);
router.route('/messages').get(clientController.getAllMessages).post(clientController.sendMessage);
router.route('/like').post(clientController.addLike);
router.route('/dislike').post(clientController.addDislike);
router.route('/unlike').delete(clientController.removeLikeOrDislike);
router.route('/accueil/search').post(clientController.accueilSearch);
router.route('/posts/comment').post(clientController.ajoutComment);
router.route('/posts/comment/reponse').post(clientController.reponseComment).delete(clientController.deleteResponseComment);
router.route('/note').post(clientController.addNote);
router.route('/share').post(clientController.ShareNb);
router.route('/view').post(clientController.ViewsNb);
router.route('/commandes').post(clientController.createCommande);
router.route('/follow').post(clientController.follow);
router.route('/profile/:identifiant').get(clientController.getSomeProfile);
export { router };
