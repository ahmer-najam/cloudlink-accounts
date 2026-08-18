import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import investorRoutes from "./routes/investorRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { ensureDefaultAdmin } from "./controllers/authController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Business portal API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/users", userRoutes);

connectDB()
  .then(async () => {
    await ensureDefaultAdmin();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
