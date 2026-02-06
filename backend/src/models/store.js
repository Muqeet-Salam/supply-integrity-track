export const batches = new Map();
export const transfers = new Map();
export const alerts = new Map();

export function saveBatch(batchId) {
  if (!batches.has(batchId)) batches.set(batchId, {});
}

export function saveTransfer(batchId, from, to) {
  const record = { from, to, timestamp: Date.now() };
  if (!transfers.has(batchId)) transfers.set(batchId, []);
  transfers.get(batchId).push(record);
  return record;
}

export function saveAlert(batchId, reason) {
  if (!alerts.has(batchId)) alerts.set(batchId, []);
  alerts.get(batchId).push({ reason, timestamp: Date.now() });
}
