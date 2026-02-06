import { addBatch, addTransfer } from "../models/store.js";
import { runAnomalyChecks } from "../anomaly/detector.js";
import { provider, contract } from "../config/blockchain.js";

export async function startListener() {
  if (!contract) {
    console.error("❌ Blockchain contract not initialized");
    return;
  }

  // Listen for BatchCreated event
  contract.on(
    "BatchCreated",
    async (batchId, productName, manufacturer, supplier, status, timestamp) => {
      await addBatch(batchId.toString());
      // Optionally store more details if needed
    },
  );

  // Listen for Transfer event
  contract.on("Transfer", async (batchId, from, to, timestamp) => {
    const transfer = {
      batchId: batchId.toString(),
      from,
      to,
      timestamp: Number(timestamp),
    };
    await addTransfer(transfer);
    await runAnomalyChecks(batchId.toString(), transfer);
  });

  // Add more event listeners as needed
  console.log("✅ Blockchain event listeners started");
}
