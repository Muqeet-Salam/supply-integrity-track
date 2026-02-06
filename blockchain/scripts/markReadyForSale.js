const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🏪 Marking batch ready for sale...\n");
  
  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("❌ deployment.json not found. Please run deployment first: npm run deploy");
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("📄 Contract address:", deployment.contractAddress);
  
  // Get signers - use the third account as supplier
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer, supplier] = signers;
  
  console.log("👤 Marking ready with supplier:", supplier.address);

  // Connect to the deployed contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(deployment.contractAddress);

  // Verify supplier role
  const isSupplier = await supplyChain.suppliers(supplier.address);
  if (!isSupplier) {
    throw new Error("❌ Account is not registered as supplier. Please run: npm run setup-roles");
  }
  
  console.log("✅ Supplier role verified");

  // Get current batch count
  const currentBatchId = await supplyChain.getCurrentBatchId();
  if (Number(currentBatchId) === 0) {
    throw new Error("❌ No batches found. Please create a batch first: npm run create-batch");
  }

  // Use the most recent batch (last one created)
  const batchId = Number(currentBatchId) - 1;
  console.log("📦 Working with batch ID:", batchId.toString());

  // Get current batch status
  const batchData = await supplyChain.getBatch(batchId);
  console.log("📊 Current batch status:");
  console.log("   Product:", batchData.productName);
  console.log("   Manufacturer:", batchData.manufacturer);
  console.log("   Status:", Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale");
  console.log("   Current Supplier:", batchData.supplier === hre.ethers.ZeroAddress ? "Not assigned" : batchData.supplier);

  // Check if batch can be marked ready for sale
  if (Number(batchData.status) !== 0) {
    const statusText = Number(batchData.status) === 1 ? "Ready for Sale" : "Unknown (" + batchData.status + ")";
    throw new Error(`❌ Batch is not in 'Manufactured' status. Current status: ${statusText}. This batch has already been processed.`);
  }

  // Mark batch ready for sale
  console.log("\n🔄 Marking batch ready for sale...");
  const tx = await supplyChain.connect(supplier).markReadyForSale(batchId);
  console.log("⏳ Transaction sent, waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

  // Get updated batch data
  const updatedBatchData = await supplyChain.getBatch(batchId);
  console.log("\n🎉 Batch status updated!");
  console.log("📊 Updated batch details:");
  console.log("   Batch ID:", updatedBatchData.batchId.toString());
  console.log("   Product:", updatedBatchData.productName);
  console.log("   Manufacturer:", updatedBatchData.manufacturer);
  console.log("   Supplier:", updatedBatchData.supplier);
  console.log("   Status:", Number(updatedBatchData.status) === 1 ? "✅ Ready for Sale" : "❓ Unknown");
  console.log("   Updated At:", new Date(Number(updatedBatchData.timestamp) * 1000).toLocaleString());

  console.log("\n🏪 Batch is now ready for sale!");
  console.log("💡 Next step: npm run view-history");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Mark ready for sale failed:", error);
    process.exit(1);
  });
