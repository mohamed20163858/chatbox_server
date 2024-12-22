import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { authController } from "../controllers/auth.controller";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.getCurrentUser);

export default router;
