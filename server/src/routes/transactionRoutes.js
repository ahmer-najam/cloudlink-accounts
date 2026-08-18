import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  getTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getTransactions);
router.post("/", allowRoles("admin", "manager"), createTransaction);
router.get("/summary", getSummary);
router.put("/:id", allowRoles("admin", "manager"), updateTransaction);
router.delete("/:id", allowRoles("admin", "manager"), deleteTransaction);

export default router;
