const batches = new Map();
const transfers = [];
const alerts = [];

export function addBatch(batchId) {
  if (!batches.has(batchId)) {
    batches.set(batchId, { batchId, createdAt: Date.now() });
  }
}

export function addTransfer(t) {
  transfers.push(t);
}

export function saveAlert(batchId, reason) {
  alerts.push({ batchId, reason, timestamp: Date.now() });
}

export function getBatch(batchId) {
  return batches.get(batchId);
}

export function getTransfers(batchId) {
  return transfers.filter((t) => t.batchId === batchId);
}

export function getAlerts(batchId) {
  return alerts.filter((a) => a.batchId === batchId);
}
