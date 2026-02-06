const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔎 Viewing batch history...\n");
  
  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("❌ deployment.json not found. Please run deployment first: npm run deploy");
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("📄 Contract address:", deployment.contractAddress);
  
  // Get signers
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer, supplier, user] = signers;
  
  console.log("👤 Querying history as user:", user.address);

  // Connect to the deployed contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(deployment.contractAddress);

  // Get current batch count
  const currentBatchId = await supplyChain.getCurrentBatchId();
  if (currentBatchId === 0n) {
    console.log("⚠️  No batches found in the system.");
    console.log("💡 Create a batch first: npm run create-batch");
    return;
  }

  console.log(`📊 Found ${currentBatchId} batch(es) in the system\n`);

  // Show history for the most recent batch by default
  // You can modify this to accept command line arguments for specific batch ID
  let batchId = currentBatchId - 1n;
  
  if (process.argv.length > 2) {
    const specifiedBatchId = parseInt(process.argv[2]);
    if (specifiedBatchId >= 0 && specifiedBatchId < currentBatchId) {
      batchId = BigInt(specifiedBatchId);
      console.log(`🎯 Showing history for specified batch ID: ${batchId}`);
    } else {
      console.log(`❌ Invalid batch ID. Available range: 0 to ${currentBatchId - 1n}`);
      return;
    }
  } else {
    console.log(`🎯 Showing history for most recent batch (ID: ${batchId})`);
    console.log("💡 To view specific batch: npx hardhat run scripts/viewHistory.js --network localhost -- BATCH_ID\n");
  }

  // Get batch data
  try {
    const batchData = await supplyChain.getBatch(batchId);
    
    console.log("═══════════════════════════════════════════");
    console.log(`📦 BATCH HISTORY - ID: ${batchData.batchId.toString()}`);
    console.log("═══════════════════════════════════════════");
    console.log();

    // Display basic batch info
    console.log("📋 Basic Information:");
    console.log("   🏷️  Product Name:", batchData.productName);
    console.log("   🏭 Manufacturer: ", batchData.manufacturer);
    console.log("   🏪 Supplier:     ", batchData.supplier === hre.ethers.ZeroAddress ? "Not assigned" : batchData.supplier);
    console.log("   📊 Status:       ", Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale");
    console.log("   🕒 Last Updated: ", new Date(Number(batchData.timestamp) * 1000).toLocaleString(), "\n");

    // Query events for this specific batch
    console.log("📜 Timeline of Events:");
    console.log("─────────────────────────────────────────");
    
    // Get BatchCreated events for this batch
    const createdFilter = supplyChain.filters.BatchCreated(batchId);
    const createdEvents = await supplyChain.queryFilter(createdFilter);
    
    // Get StatusUpdated events for this batch
    const statusFilter = supplyChain.filters.StatusUpdated(batchId);
    const statusEvents = await supplyChain.queryFilter(statusFilter);

    // Combine and sort events by block number
    const allEvents = [...createdEvents, ...statusEvents].sort((a, b) => 
      a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex
    );

    if (allEvents.length === 0) {
      console.log("⚠️  No events found for this batch");
    } else {
      for (let i = 0; i < allEvents.length; i++) {
        const event = allEvents[i];
        const block = await hre.ethers.provider.getBlock(event.blockNumber);
        const timestamp = new Date(block.timestamp * 1000);
        
        console.log(`${i + 1}. ${event.fragment.name.toUpperCase()}`);
        
        if (event.fragment.name === "BatchCreated") {
          console.log(`   🏭 Manufactured by: ${event.args.manufacturer}`);
          console.log(`   📦 Product: ${event.args.productName}`);
        } else if (event.fragment.name === "StatusUpdated") {
          const status = event.args.newStatus === 0n ? "Manufactured" : "Ready for Sale";
          console.log(`   📊 Status changed to: ${status}`);
          console.log(`   👤 Updated by: ${event.args.updatedBy}`);
        }
        
        console.log(`   🕒 Time: ${timestamp.toLocaleString()}`);
        console.log(`   🔗 Block: ${event.blockNumber} | Tx: ${event.transactionHash}`);
        
        if (i < allEvents.length - 1) console.log("   ⬇️");
      }
    }

    console.log();
    console.log("═══════════════════════════════════════════");
    console.log("🔍 Analysis Summary:");
    
    // Analysis
    const isComplete = batchData.supplier !== hre.ethers.ZeroAddress && Number(batchData.status) === 1;
    const statusText = Number(batchData.status) === 1 ? "Ready for Sale" : "In Manufacturing";
    
    console.log(`   📊 Current Status: ${statusText}`);
    console.log(`   🏪 Supply Chain: ${isComplete ? "Complete" : "In Progress"}`);
    console.log(`   🔄 Events Count: ${allEvents.length}`);
    
    if (isComplete) {
      console.log("   ✅ This batch has completed the supply chain process!");
    } else if (Number(batchData.status) === 1 && batchData.supplier === hre.ethers.ZeroAddress) {
      console.log("   ⚠️  This batch has inconsistent state - marked as ready but no supplier assigned.");
    } else {
      console.log("   ⏳ This batch is still in the manufacturing stage.");
    }
    
  } catch (error) {
    if (error.message.includes("InvalidBatch")) {
      console.log(`❌ Batch ID ${batchId} not found.`);
      console.log(`📊 Available batch IDs: 0 to ${currentBatchId - 1n}`);
    } else {
      throw error;
    }
  }
  
  console.log("\n🎉 History query completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ View history failed:", error);
    process.exit(1);
  });