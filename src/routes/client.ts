import express from "express";
import clientController from "../controller/ClientController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";
//
const router = express.Router();
//

router.use(isAuthenticatedGlobal); // Utilisez le middleware pour toutes les routes

// Définir la route GET pour récupérer les notifications ///////////////////////
router.route('/notifications').get(clientController.getNotificationsForUser);
// Route pour afficher le profil du client////////////////////////////////
router.route('/profile').get(clientController.showClientProfile);
//   //////////////////////////////////////////////////////////////////
router.route('/profileUser').get(clientController.userProfile);
// Route pour ajouter un like ou un dislike// Route pour ajouter un like//////////////////////////////////////
router.route('/like').post(clientController.addLike);

router.route('/dislike').post(clientController.addDislike);

//send message
router.route('/sendMessage').post(clientController.sendMessage);

router.route('/bloquer').post(clientController.blockCompte);


export { router };
