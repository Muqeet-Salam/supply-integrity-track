import express from "express";
import { getHistory, getIntegrity } from "../controllers/batchController.js";

const router = express.Router();

router.get("/:id/history", getHistory);
router.get("/:id/integrity", getIntegrity);

export default router;
