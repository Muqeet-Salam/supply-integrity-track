import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import batchRoutes from "./routes/batchRoutes.js";
import { startListener } from "./listeners/supplyChainListener.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/batch", batchRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Backend running on ${process.env.PORT}`);
  startListener();
});
