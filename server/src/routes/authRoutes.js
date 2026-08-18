import { Router } from "express";
import { login, me, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", protect, me);
router.put("/me", protect, updateProfile);

export default router;
