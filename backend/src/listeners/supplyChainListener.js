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
      await addBatch(batchId.toString(), {
        productName,
        manufacturer,
        supplier,
        status: status.toString(),
        timestamp: new Date(Number(timestamp)),
      });
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
