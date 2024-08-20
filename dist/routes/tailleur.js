import express from "express";
import { isTailleurAuthenticated } from "../middleware/authTailleur.js";
const router = express.Router();
router.use(isTailleurAuthenticated);
export { router };
