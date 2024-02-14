import express from "express";
import { authController, google, signin } from "../Controller/authController.js";

const router = express.Router();

router.post("/signup", authController);
router.post("/signin", signin);
router.post("/google", google);


export default router;