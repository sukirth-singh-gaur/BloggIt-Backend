import express from "express";
import languageCheck from "../controllers/languageToolController.js";
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route("/grammar-check").post(protect,languageCheck);

export default router;
