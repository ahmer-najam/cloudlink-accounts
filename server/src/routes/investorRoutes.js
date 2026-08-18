import { Router } from "express";
import {
  createInvestor,
  deleteInvestor,
  getInvestorSummary,
  getInvestors,
  updateInvestor
} from "../controllers/investorController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getInvestors);
router.post("/", allowRoles("admin", "manager"), createInvestor);
router.get("/summary", getInvestorSummary);
router.put("/:id", allowRoles("admin", "manager"), updateInvestor);
router.delete("/:id", allowRoles("admin", "manager"), deleteInvestor);

export default router;
