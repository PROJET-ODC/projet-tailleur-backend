import express from "express";
import clientController from "../controller/ClientController.js";
import { isAuthenticatedGlobal } from "../middleware/auth.js";
const router = express.Router();
router.use(isAuthenticatedGlobal);
router.route('/share').post(clientController.ShareNb);
router.route('/view').post(clientController.ViewsNb);
router.route('/commandes').post(clientController.createCommande);
export { router };
