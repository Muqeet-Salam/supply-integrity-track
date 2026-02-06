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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const batch = await getBatch(id);
  if (!batch) return res.status(404).json({ error: "Batch not found" });

  res.json({
    batch,
    transfers: await getTransfers(id),
    alerts: await getAlerts(id),
  });
});

// POST create batch
router.post("/", async (req, res) => {
  const { batchId } = req.body;
  if (!batchId) return res.status(400).json({ error: "batchId required" });

  await addBatch(batchId);
  res.json({ success: true, batchId });
});

// POST add transfer
router.post("/:id/transfers", async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.body;

  if (!from || !to)
    return res.status(400).json({ error: "from and to required" });

  const transfer = { batchId: id, from, to, timestamp: Date.now() };
  await addTransfer(transfer);

  res.json({ success: true, transfer });
});

export default router;
