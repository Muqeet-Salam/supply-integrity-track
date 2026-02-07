import express from "express";
import cors from "cors";
import "dotenv/config";
import batchRoutes from "./routes/batches.js";
import { startListener } from "./listeners/supplyChainListener.js";

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/api/batches", batchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on ${PORT} (CORS: ${CORS_ORIGIN})`);
  console.log(`RPC_URL=${process.env.RPC_URL || 'not set'}`);
  startListener();
});
