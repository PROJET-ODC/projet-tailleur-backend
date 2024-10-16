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

router.route('/status').post(tailleurController.createStatus).delete(tailleurController.deleteStatus);
// .get(tailleurController.getStatuses)

        router.route('/posts').post(tailleurController.createPost);
        router.route('/posts').get(tailleurController.getPosts);

router.route('/posts/:postId').put(tailleurController.updatePost).delete(tailleurController.deletePost);

router.route('/achetercredit').post(tailleurController.acheterCredit);
router.route('/articles/categories').get(tailleurController.getArticleCategories);
// router.route('/articles').get(tailleurController.getAllArticles);
// router.route('/articles/:slug').get(tailleurController.getSomeArticle);
router.route('/approvisions').get(tailleurController.getAllApprovisions).post(tailleurController.addApprovisions);
router.route('/approvisions/payereste').post(tailleurController.payerResteCommande);

router.route('/approvisions/details').get(tailleurController.detailsApprovisions);
router.route('/allposts').get(tailleurController.getAllPostTailleur);

router.route('/listcommandes').get(tailleurController.listCommandes);

// Route to list articles by category
// router.get('/categories/:categoryId/articles', tailleurController.listArticlesByCategory);
router.route('/articles/:slug').get(tailleurController.getArticleBySlug);

export {router};

