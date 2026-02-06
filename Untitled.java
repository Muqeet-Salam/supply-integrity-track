import express from "express";
import cors from "cors";
import "dotenv/config";
import batchRoutes from "./routes/batches.js";
import { startListener } from "./listeners/supplyChainListener.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/batches", batchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on ${PORT}`);
  startListener();
});
