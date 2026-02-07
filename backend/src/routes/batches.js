import express from "express";
import {
  getBatch as getBatchFromDb,
  getTransfers,
  getAlerts,
  addBatch,
  addTransfer,
  getAllBatches,
  updateBatchStatus,
  getNextBatchCounter,
  incrementBatchCounter,
} from "../models/store.js";
import {
  contract,
  getManufacturerContract,
  getSupplierContract,
  provider,
  addresses,
} from "../config/blockchain.js";

const router = express.Router();

function formatOnChainBatch(batch) {
  if (!batch) return null;
  return {
    batchId: Number(batch.batchId),
    productName: batch.productName,
    manufacturer: batch.manufacturer,
    supplier: batch.supplier,
    status: Number(batch.status),
    timestamp: Number(batch.timestamp) * 1000,
  };
}

// GET all batches (on-chain overview)
router.get("/", async (req, res) => {
  try {
    const nextId = Number(await contract.getCurrentBatchId());
    const batches = [];

    for (let i = 0; i < nextId; i++) {
      try {
        const raw = await contract.getBatch(i);
        const batch = formatOnChainBatch(raw);
        // Merge any DB metadata
        const dbBatch = await getBatchFromDb(i);
        batches.push({ ...batch, ...(dbBatch || {}) });
      } catch {
        // skip invalid
      }
    }

    res.json(batches);
  } catch (err) {
    // Fallback: return Firebase-only list
    try {
      const dbBatches = await getAllBatches();
      res.json(dbBatches);
    } catch (fbErr) {
      console.error("Error listing batches:", err);
      res.status(500).json({ error: "Failed to list batches" });
    }
  }
});

// GET next batch id from contract
router.get("/current-id", async (req, res) => {
  try {
    const nextId = await contract.getCurrentBatchId();
    res.json({ nextBatchId: Number(nextId) });
  } catch (err) {
    console.error("Error fetching current batch id:", err);
    res.status(500).json({ error: "Failed to fetch current batch id" });
  }
});

// GET batch info (on-chain + Firebase)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let onChainBatch = null;

    try {
      const rawBatch = await contract.getBatch(id);
      onChainBatch = formatOnChainBatch(rawBatch);
    } catch (e) {
      // If batch doesn't exist on-chain, we'll just return DB data if present
    }

    const dbBatch = await getBatchFromDb(id);

    if (!onChainBatch && !dbBatch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const [transfers, alerts] = await Promise.all([
      getTransfers(id),
      getAlerts(id),
    ]);

    res.json({
      onChain: onChainBatch,
      db: dbBatch,
      transfers,
      alerts,
    });
  } catch (err) {
    console.error("Error fetching batch:", err);
    res.status(500).json({ error: "Failed to fetch batch" });
  }
});

// POST create batch (calls smart contract createBatch)
router.post("/", async (req, res) => {
  const { productName } = req.body;
  if (!productName) {
    return res.status(400).json({ error: "productName required" });
  }

  try {
    let receipt;

    if (process.env.MANUFACTURER_PRIVATE_KEY) {
      const sc = getManufacturerContract();
      const tx = await sc.createBatch(productName);
      receipt = await tx.wait();
    } else {
      // Use JSON-RPC eth_sendTransaction with unlocked Hardhat account
      const data = contract.interface.encodeFunctionData("createBatch", [productName]);
      const txHash = await provider.send("eth_sendTransaction", [
        { to: addresses.contract, from: addresses.manufacturer, data },
      ]);
      receipt = await provider.waitForTransaction(txHash);
    }

    console.log("createBatch tx confirmed in block", receipt.blockNumber);

    const currentId = await contract.getCurrentBatchId();
    const createdId = Number(currentId) - 1;

    // Fetch on-chain batch to get manufacturer address
    let manufacturer = addresses.manufacturer;
    try {
      const onChain = await contract.getBatch(createdId);
      manufacturer = onChain.manufacturer || manufacturer;
    } catch (_) {}

    // Get Firebase counter and increment
    const batchCounter = await getNextBatchCounter();
    await addBatch(createdId, { productName, manufacturer, batchNumber: batchCounter });
    await incrementBatchCounter(batchCounter);

    res.json({ success: true, batchId: createdId, batchNumber: batchCounter, productName, manufacturer });
  } catch (err) {
    console.error("Error creating batch:", err);
    res.status(500).json({ error: "Failed to create batch" });
  }
});

// POST mark batch ready for sale (calls smart contract markReadyForSale)
router.post("/:id/ready", async (req, res) => {
  const { id } = req.params;

  try {
    const batchId = parseInt(id, 10);
    if (Number.isNaN(batchId)) {
      return res.status(400).json({ error: "Invalid batch id" });
    }

    let receipt;
    if (process.env.SUPPLIER_PRIVATE_KEY) {
      const sc = getSupplierContract();
      const tx = await sc.markReadyForSale(batchId);
      receipt = await tx.wait();
    } else {
      const data = contract.interface.encodeFunctionData("markReadyForSale", [
        batchId,
      ]);
      const txHash = await provider.send("eth_sendTransaction", [
        { to: addresses.contract, from: addresses.supplier, data },
      ]);
      receipt = await provider.waitForTransaction(txHash);
    }

    console.log("markReadyForSale tx confirmed in block", receipt.blockNumber);

    const updatedBatch = await contract.getBatch(batchId);

    // Update status in Firebase
    await updateBatchStatus(batchId, "Ready for Sale");

    res.json({
      success: true,
      batch: formatOnChainBatch(updatedBatch),
    });
  } catch (err) {
    console.error("Error marking batch ready:", err);
    res.status(500).json({ error: "Failed to mark batch ready" });
  }
});

// GET batch history from blockchain events
router.get("/:id/history", async (req, res) => {
  const { id } = req.params;

  try {
    const batchId = parseInt(id, 10);
    if (Number.isNaN(batchId)) {
      return res.status(400).json({ error: "Invalid batch id" });
    }

    const createdFilter = contract.filters.BatchCreated(batchId);
    const statusFilter = contract.filters.StatusUpdated(batchId);

    const [createdEvents, statusEvents] = await Promise.all([
      contract.queryFilter(createdFilter),
      contract.queryFilter(statusFilter),
    ]);

    const allEvents = [...createdEvents, ...statusEvents].sort(
      (a, b) =>
        a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex
    );

    const events = [];
    for (const ev of allEvents) {
      const block = await provider.getBlock(ev.blockNumber);
      const timestamp = Number(block.timestamp) * 1000;

      const name = ev.fragment ? ev.fragment.name : ev.eventName;

      if (name === "BatchCreated") {
        events.push({
          type: "BatchCreated",
          batchId: Number(ev.args.batchId),
          productName: ev.args.productName,
          manufacturer: ev.args.manufacturer,
          timestamp,
          blockNumber: ev.blockNumber,
          transactionHash: ev.transactionHash,
        });
      } else if (name === "StatusUpdated") {
        events.push({
          type: "StatusUpdated",
          batchId: Number(ev.args.batchId),
          newStatus: Number(ev.args.newStatus),
          updatedBy: ev.args.updatedBy,
          timestamp,
          blockNumber: ev.blockNumber,
          transactionHash: ev.transactionHash,
        });
      }
    }

    res.json({ batchId, events });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch batch history" });
  }
});

// POST add transfer (off-chain tracking only)
router.post("/:id/transfers", async (req, res) => {
  const { id } = req.params;
  const { from, to, location } = req.body;

  if (!to) {
    return res.status(400).json({ error: "'to' address is required" });
  }

  try {
    const transfer = { batchId: id, from: from || 'unknown', to, location: location || '', timestamp: Date.now() };
    await addTransfer(transfer);

    res.json({ success: true, transfer });
  } catch (err) {
    console.error("Error adding transfer:", err);
    res.status(500).json({ error: "Failed to add transfer" });
  }
});

export default router;
