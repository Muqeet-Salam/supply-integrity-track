import { addBatch, addTransfer } from "../models/store.js";
import { runAnomalyChecks } from "../anomaly/detector.js";

export function startListener() {
  console.log("🧪 Mock blockchain listener running...");

  const batchId = "101";
  addBatch(batchId);

  const transfers = [
    { batchId, from: "0xAAA", to: "0xBBB", timestamp: Date.now() },
    { batchId, from: "0xBBB", to: "0xCCC", timestamp: Date.now() + 1000 },
  ];

  for (const t of transfers) {
    addTransfer(t);
    runAnomalyChecks(batchId, t);
  }
}
