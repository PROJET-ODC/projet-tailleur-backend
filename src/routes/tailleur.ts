//
//
import express from "express";
import tailleurController from "../controller/TailleurController.js";
import { isTailleurAuthenticated } from "../middleware/authTailleur.js";

const router = express.Router();
//
// Middleware pour vérifier l'authentification
router.use(isTailleurAuthenticated);

// router.route('/status').get(tailleurController.listStatus).post(tailleurController.createStatus);

export {router};
//
