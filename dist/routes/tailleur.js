import express from "express";
import tailleurController from "../controller/TailleurController.js";
import { isTailleurAuthenticated } from "../middleware/authTailleur.js";
const router = express.Router();
router.use(isTailleurAuthenticated);
router.route('/status').post(tailleurController.createStatus);
router.route('/posts').post(tailleurController.createPost);
router.route('/posts/:postId').put(tailleurController.updatePost).delete(tailleurController.deletePost);
export { router };
