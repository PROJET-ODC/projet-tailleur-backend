import express from "express";
import {isVendeurAuthenticated} from "../middleware/authVendeur.js";
import vendeurController from "../controller/VendeurController.js";
const router = express.Router();

router.use(isVendeurAuthenticated);

router.route('/articles')
    .post(vendeurController.addArticle)
    .get(vendeurController.myArticles)
    .put(vendeurController.updateArticle);

router.route('/commandes')
    .get(vendeurController.myCommandes);

router.route('/commandes/validate')
    .post(vendeurController.validateCommandes);

export {router};