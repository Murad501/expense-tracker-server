import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.get("/me", auth(), AuthController.me);

export const authRoutes = router;
