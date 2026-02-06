import { transfers, alerts } from "../models/store.js";

export function getHistory(req, res) {
  const id = req.params.id;
  res.json({
    batchId: id,
    history: transfers.get(id) || [],
    alerts: alerts.get(id) || [],
  });
}

export function getIntegrity(req, res) {
  const id = req.params.id;
  const issues = alerts.get(id) || [];
  const score = Math.max(100 - issues.length * 30, 0);

  res.json({
    batchId: id,
    status: issues.length ? "TAMPERED" : "SAFE",
    score,
    alerts: issues,
  });
}
