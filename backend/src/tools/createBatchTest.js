import { getManufacturerContract, contract } from "../config/blockchain.js";

async function main() {
  try {
    const sc = getManufacturerContract();
    console.log("Calling createBatch on contract...");
    const tx = await sc.createBatch("Integration Test Product");
    console.log("TX sent, waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Confirmed in block", receipt.blockNumber);

    const currentId = await contract.getCurrentBatchId();
    const createdId = Number(currentId) - 1;
    console.log("Created batch id:", createdId);
  } catch (err) {
    console.error("createBatch test error:", err);
    process.exit(1);
  }
}

main();
