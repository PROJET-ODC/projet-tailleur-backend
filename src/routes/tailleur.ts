//
//
import express from "express";
// import uploadMiddleware from '../multer.js'; // Chemin vers votre fichier de configuration Multer
import tailleurController from "../controller/TailleurController.js";
import { isTailleurAuthenticated } from "../middleware/authTailleur.js";

const router = express.Router();
//
// Middleware pour vérifier l'authentification
router.use(isTailleurAuthenticated);

router.route('/status').post(tailleurController.createStatus);
// .get(tailleurController.listStatus).

router.route('/posts').post(tailleurController.createPost);

// .get(tailleurController.listMyAllPosts);
router.route('/posts/:postId').put(tailleurController.updatePost).delete(tailleurController.deletePost);


// router.route('/achetercredit').post(tailleurController.acheterCredit);

export {router};
//


