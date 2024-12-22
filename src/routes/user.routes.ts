import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { userController } from "../controllers/user.controller";

const router = Router();

router.use(auth); // Protect all user routes

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.get("/contacts", userController.getContacts);
router.post("/contacts", userController.addContact);
router.delete("/contacts/:id", userController.removeContact);

export default router;
