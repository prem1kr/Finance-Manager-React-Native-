import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/authRoute/auth.js";
import googleRouter from "./routes/authRoute/googleAuth.js";
import cors from "cors";
import TransactionRouter from "./routes/transaction/Transaction.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// API routes
app.use("/api", authRouter);
app.use("/api", googleRouter);
app.use("/api", TransactionRouter);

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  connectDb();
});
