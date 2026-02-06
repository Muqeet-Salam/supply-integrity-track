const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

async function main() {
  console.log("🔄 Blockchain-Connected QR Updater...\n");
  
  // Load deployment info first
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ deployment.json not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  console.log("📄 Contract:", deployment.contractAddress);

  // Get signers
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer, supplier, user] = signers;

  // Connect to the deployed contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(deployment.contractAddress);

  // Get batch ID - if not provided, use the most recent batch
  let batchId;
  if (process.argv.length > 2 && !isNaN(process.argv[2])) {
    batchId = parseInt(process.argv[2]);
    console.log("📦 Using provided Batch ID:", batchId);
  } else {
    // Get the most recent batch
    const currentBatchId = await supplyChain.getCurrentBatchId();
    if (Number(currentBatchId) === 0) {
      console.error("❌ No batches found. Create a batch first: npm run create-batch");
      process.exit(1);
    }
    batchId = Number(currentBatchId) - 1;
    console.log("📦 Using most recent Batch ID:", batchId);
  }

  // Fetch current batch data from blockchain
  try {
    const batchData = await supplyChain.getBatch(batchId);
    
    console.log("\n📊 Current Blockchain Data:");
    console.log("   🆔 Batch ID:", batchData.batchId.toString());
    console.log("   📦 Product:", batchData.productName);
    console.log("   🏭 Manufacturer:", batchData.manufacturer);
    console.log("   🏪 Supplier:", batchData.supplier === hre.ethers.ZeroAddress ? "Not assigned" : batchData.supplier);
    console.log("   📊 Status:", Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale");
    console.log("   🕒 Last Updated:", new Date(Number(batchData.timestamp) * 1000).toLocaleString());

    // Create QR codes directory
    const qrDirectory = path.join(__dirname, "../qr-codes");
    if (!fs.existsSync(qrDirectory)) {
      fs.mkdirSync(qrDirectory, { recursive: true });
    }

    // Create comprehensive QR data with live blockchain data
    const qrData = {
      batchId: Number(batchData.batchId),
      productName: batchData.productName,
      manufacturer: batchData.manufacturer,
      supplier: batchData.supplier === hre.ethers.ZeroAddress ? null : batchData.supplier,
      status: Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale",
      contractAddress: deployment.contractAddress,
      network: hre.network.name,
      createdAt: new Date(Number(batchData.timestamp) * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      verificationUrl: `https://etherscan.io/address/${deployment.contractAddress}`,
      type: "supply-chain-batch-updated"
    };

    console.log("\n🔲 Generating updated QR with live blockchain data...");

    // Generate QR code as PNG file
    const qrFileName = `batch_${batchId}_live_qr.png`;
    const qrFilePath = path.join(qrDirectory, qrFileName);
    
    await QRCode.toFile(qrFilePath, JSON.stringify(qrData), {
      width: 450,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log("✅ Live QR Code saved:", qrFilePath);
    
    // Generate terminal QR code
    const qrString = await QRCode.toString(JSON.stringify(qrData), {
      type: 'terminal',
      width: 60
    });
    
    console.log("\n📱 Live QR Code (scan with your device):");
    console.log(qrString);
    
    // Save QR data as JSON
    const qrDataFileName = `batch_${batchId}_live_qr_data.json`;
    const qrDataFilePath = path.join(qrDirectory, qrDataFileName);
    fs.writeFileSync(qrDataFilePath, JSON.stringify(qrData, null, 2));
    console.log("\n📄 Live QR data saved:", qrDataFilePath);
    
    console.log("\n🎉 Live QR Code generation completed!");
    console.log("📊 QR now contains current status:", qrData.status);
    console.log("💡 Scan QR: npm run scan-qr", qrDataFileName);

  } catch (error) {
    if (error.message.includes("InvalidBatch")) {
      console.error(`❌ Batch ID ${batchId} does not exist`);
    } else {
      console.error("❌ Failed to fetch batch data:", error.message);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Live QR update failed:", error);
    process.exit(1);
  });