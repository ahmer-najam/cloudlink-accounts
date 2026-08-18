import { Router } from "express";
import {
  addBank,
  deleteBank,
  getSettings,
  updateBank,
  updateCurrency
} from "../controllers/settingController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getSettings);
router.put("/currency", allowRoles("admin"), updateCurrency);
router.post("/banks", allowRoles("admin"), addBank);
router.put("/banks/:bankId", allowRoles("admin"), updateBank);
router.delete("/banks/:bankId", allowRoles("admin"), deleteBank);

export default router;
