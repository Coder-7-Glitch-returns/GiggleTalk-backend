// ===== routes/auth_routes.js =====

// ----- Imports -----
import express from "express";
import authController from "../controllers/auth_controllers.js";
const router = express.Router();

// ----- Routes -----

// Signup
router.post("/signup", authController.signUp);

export default router;