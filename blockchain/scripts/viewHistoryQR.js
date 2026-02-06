const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

async function main() {
  console.log("🔎 QR-Based Batch History Viewer...\n");
  
  let batchId;
  let qrData;
  let qrSourceInfo = "";
  
  if (process.argv.length > 2) {
    const input = process.argv[2];
    
    // Check if input is a file path to QR data
    if (input.includes('.json') && fs.existsSync(input)) {
      console.log("📄 Reading QR data from file:", input);
      qrData = JSON.parse(fs.readFileSync(input, "utf8"));
      batchId = qrData.batchId;
      qrSourceInfo = `📱 QR Source: ${path.basename(input)}`;
    } 
    // Check if input is a batch ID
    else if (!isNaN(input)) {
      batchId = parseInt(input);
      console.log("📦 Using batch ID:", batchId);
      qrSourceInfo = "📱 QR Source: Manual batch ID input";
    }
    // Assume input is direct QR JSON data
    else {
      try {
        qrData = JSON.parse(input);
        batchId = qrData.batchId;
        console.log("📱 Processing QR data directly");
        qrSourceInfo = "📱 QR Source: Direct QR JSON data";
      } catch (e) {
        throw new Error("❌ Invalid input. Provide batch ID, QR data file path, or QR JSON data");
      }
    }
  } else {
    // If no argument provided, show available QR files
    console.log("📋 Available QR Code Files:");
    const qrDirectory = path.join(__dirname, "../qr-codes");
    
    if (fs.existsSync(qrDirectory)) {
      const qrFiles = fs.readdirSync(qrDirectory)
        .filter(file => file.endsWith('_qr_data.json'))
        .sort();
      
      if (qrFiles.length > 0) {
        qrFiles.forEach((file, index) => {
          const data = JSON.parse(fs.readFileSync(path.join(qrDirectory, file), "utf8"));
          console.log(`   ${index + 1}. ${file} (Batch ${data.batchId}: ${data.productName})`);
        });
        
        // Use the most recent one by default
        const latestFile = qrFiles[qrFiles.length - 1];
        const latestQRFile = path.join(qrDirectory, latestFile);
        console.log(`\n📄 Using most recent QR data file: ${latestFile}`);
        qrData = JSON.parse(fs.readFileSync(latestQRFile, "utf8"));
        batchId = qrData.batchId;
        qrSourceInfo = `📱 QR Source: ${latestFile}`;
        console.log("💡 To view specific batch: npx hardhat run scripts/viewHistoryQR.js --network localhost -- BATCH_ID");
        console.log("💡 To view from QR file: npx hardhat run scripts/viewHistoryQR.js --network localhost -- path/to/qr_data.json\n");
      } else {
        throw new Error("❌ No QR data files found. Create a batch first: npm run create-batch");
      }
    } else {
      throw new Error("❌ No QR codes directory found. Create a batch first: npm run create-batch");
    }
  }

  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("❌ deployment.json not found. Please run deployment first: npm run deploy");
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("📄 Contract address:", deployment.contractAddress);
  
  // If QR data is available, verify contract address
  if (qrData && qrData.contractAddress && qrData.contractAddress !== deployment.contractAddress) {
    console.warn("⚠️  Warning: QR contract address doesn't match current deployment");
    console.log("   QR Contract:", qrData.contractAddress);
    console.log("   Current Contract:", deployment.contractAddress);
    console.log("   This QR code may be from a different deployment\n");
  }

  // Get signers
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer, supplier, user] = signers;
  
  console.log("👤 Querying history as user:", user.address);
  console.log(qrSourceInfo);

  // Connect to the deployed contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(deployment.contractAddress);

  // Get batch data from blockchain
  try {
    const batchData = await supplyChain.getBatch(batchId);
    
    console.log("\n═══════════════════════════════════════════");
    console.log(`📱 QR-BASED BATCH HISTORY - ID: ${batchData.batchId.toString()}`);
    console.log("═══════════════════════════════════════════");
    
    // Display QR data comparison if available
    if (qrData) {
      console.log("\n🔍 QR Data vs Blockchain Verification:");
      console.log("┌─────────────────────┬─────────────────────┬─────────────────────┐");
      console.log("│ Field               │ QR Code Data        │ Blockchain Data     │");
      console.log("├─────────────────────┼─────────────────────┼─────────────────────┤");
      console.log(`│ Batch ID            │ ${String(qrData.batchId).padEnd(19)} │ ${String(batchData.batchId).padEnd(19)} │`);
      console.log(`│ Product             │ ${(qrData.productName || 'N/A').substring(0, 19).padEnd(19)} │ ${batchData.productName.substring(0, 19).padEnd(19)} │`);
      console.log(`│ Manufacturer        │ ${(qrData.manufacturer || 'N/A').substring(0, 19).padEnd(19)} │ ${batchData.manufacturer.substring(0, 19).padEnd(19)} │`);
      
      const qrStatus = qrData.status || (Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale");
      const blockchainStatus = Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale";
      console.log(`│ Status              │ ${String(qrStatus).padEnd(19)} │ ${String(blockchainStatus).padEnd(19)} │`);
      console.log("└─────────────────────┴─────────────────────┴─────────────────────┘");
      
      // Verification status
      const isDataValid = 
        qrData.batchId === Number(batchData.batchId) &&
        qrData.productName === batchData.productName &&
        qrData.manufacturer.toLowerCase() === batchData.manufacturer.toLowerCase();
      
      console.log(`\n🔐 QR Verification: ${isDataValid ? '✅ VALID' : '❌ MISMATCH'}`);
      if (!isDataValid) {
        console.log("⚠️  QR data doesn't match blockchain data - possible tampering or outdated QR");
      }
      
      if (qrData.createdAt) {
        console.log("📅 QR Creation Time:", new Date(qrData.createdAt).toLocaleString());
      }
      if (qrData.lastUpdated) {
        console.log("🔄 QR Last Updated:", new Date(qrData.lastUpdated).toLocaleString());
      }
    }

    // Display current blockchain data
    console.log("\n📋 Current Blockchain Status:");
    console.log("   🏷️  Product Name:", batchData.productName);
    console.log("   🏭 Manufacturer: ", batchData.manufacturer);
    console.log("   🏪 Supplier:     ", batchData.supplier === hre.ethers.ZeroAddress ? "Not assigned" : batchData.supplier);
    console.log("   📊 Status:       ", Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale");
    console.log("   🕒 Last Updated: ", new Date(Number(batchData.timestamp) * 1000).toLocaleString());

    // Query events for this specific batch
    console.log("\n📜 Complete Timeline of Events:");
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
        const timestamp = new Date(Number(block.timestamp) * 1000);
        
        // Get event name from topics or args
        let eventName = "UNKNOWN_EVENT";
        if (event.args && event.args.length > 0) {
          if (event.args.manufacturer) {
            eventName = "BatchCreated";
          } else if (event.args.newStatus !== undefined) {
            eventName = "StatusUpdated";
          }
        }
        
        console.log(`${i + 1}. ${eventName.toUpperCase()}`);
        
        if (eventName === "BatchCreated") {
          console.log(`   🏭 Manufactured by: ${event.args.manufacturer}`);
          console.log(`   📦 Product: ${event.args.productName}`);
        } else if (eventName === "StatusUpdated") {
          const status = Number(event.args.newStatus) === 0 ? "Manufactured" : "Ready for Sale";
          console.log(`   📊 Status changed to: ${status}`);
          console.log(`   👤 Updated by: ${event.args.updatedBy}`);
        }
        
        console.log(`   🕒 Time: ${timestamp.toLocaleString()}`);
        console.log(`   🔗 Block: ${event.blockNumber} | Tx: ${event.transactionHash.substring(0, 42)}...`);
        
        if (i < allEvents.length - 1) console.log("   ⬇️");
      }
    }

    console.log("\n═══════════════════════════════════════════");
    console.log("🔍 QR Analysis Summary:");
    console.log(`   📱 QR-Based Query: ${qrData ? 'Yes' : 'No'}`);
    console.log(`   📊 Current Status: ${Number(batchData.status) === 0 ? 'Manufactured' : 'Ready for Sale'}`);
    console.log(`   🏪 Supply Chain: ${Number(batchData.status) === 1 ? 'Complete' : 'In Progress'}`);
    console.log(`   🔄 Events Count: ${allEvents.length}`);
    console.log(`   ${Number(batchData.status) === 1 ? '✅ This batch has completed the supply chain process!' : '🔄 This batch is still in the supply chain process'}`);

    // Generate a scannable QR for this query result
    console.log("\n🔲 Generating verification QR code...");
    const verificationQR = {
      batchId: Number(batchData.batchId),
      verified: true,
      verificationTime: new Date().toISOString(),
      blockchainData: {
        productName: batchData.productName,
        manufacturer: batchData.manufacturer,
        supplier: batchData.supplier === hre.ethers.ZeroAddress ? null : batchData.supplier,
        status: Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale",
        lastUpdated: new Date(Number(batchData.timestamp) * 1000).toISOString()
      },
      contractAddress: deployment.contractAddress,
      network: hre.network.name
    };

    const qrString = await QRCode.toString(JSON.stringify(verificationQR), {
      type: 'terminal',
      width: 40
    });
    
    console.log("\n📱 Verification QR Code:");
    console.log(qrString);

    console.log("\n🎉 QR-based history query completed!");

  } catch (error) {
    if (error.message.includes("InvalidBatch")) {
      throw new Error(`❌ Batch ID ${batchId} does not exist`);
    }
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ QR history view failed:", error);
    process.exit(1);
  });