import express from "express";
import languageCheck from "../controllers/languageToolController.js";
const router = express.Router();

router.route("/grammar-check").post(languageCheck);

export default router;
