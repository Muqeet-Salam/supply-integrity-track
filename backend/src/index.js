import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import batchRoutes from "./routes/batches.js";
import { startListener } from "./listeners/supplyChainListener.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Supply Integrity Track Backend is running. Use /api/batches endpoints.",
  );
});

app.use("/api/batches", batchRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/supply-integrity-track";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on ${PORT}`);
      startListener();
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
