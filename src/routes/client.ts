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

router.route('/accueil/search').post(clientController.accueilSearch);

router.route('/follow').post(clientController.follow);

router.route('/bloquer').post(isAuthenticatedGlobal, clientController.bloquer);

router.route('/profile/:identifiant').get(clientController.getSomeProfile);

export { router };
