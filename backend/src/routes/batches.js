import express from "express";
import {
  getBatch,
  getTransfers,
  getAlerts,
  addBatch,
  addTransfer,
} from "../models/store.js";

const router = express.Router();

// GET batch info
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const batch = getBatch(id);
  if (!batch) return res.status(404).json({ error: "Batch not found" });

  res.json({
    batch,
    transfers: getTransfers(id),
    alerts: getAlerts(id),
  });
});

// POST create batch
router.post("/", (req, res) => {
  const { batchId } = req.body;
  if (!batchId) return res.status(400).json({ error: "batchId required" });

  addBatch(batchId);
  res.json({ success: true, batchId });
});

// POST add transfer
router.post("/:id/transfers", (req, res) => {
  const { id } = req.params;
  const { from, to } = req.body;

  if (!from || !to)
    return res.status(400).json({ error: "from and to required" });

  const transfer = { batchId: id, from, to, timestamp: Date.now() };
  addTransfer(transfer);

  res.json({ success: true, transfer });
});

export default router;
