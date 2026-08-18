import { Router } from "express";
import { createUser, listUsers, updateUser } from "../controllers/userController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, allowRoles("admin"));
router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id", updateUser);

export default router;
