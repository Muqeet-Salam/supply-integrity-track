const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

async function main() {
  console.log("🔄 QR-Based Batch Updater for Manufacturers...\n");
  
  // Check if batch ID was provided as argument
  let batchId;
  let qrData;
  
  if (process.argv.length > 2) {
    const input = process.argv[2];
    
    // Check if input is a file path to QR data
    if (input.includes('.json') && fs.existsSync(input)) {
      console.log("📄 Reading QR data from file:", input);
      qrData = JSON.parse(fs.readFileSync(input, "utf8"));
      batchId = qrData.batchId;
    } 
    // Check if input is a batch ID
    else if (!isNaN(input)) {
      batchId = parseInt(input);
      console.log("📦 Using batch ID:", batchId);
    }
    // Assume input is direct QR JSON data
    else {
      try {
        qrData = JSON.parse(input);
        batchId = qrData.batchId;
        console.log("📱 Processing QR data directly");
      } catch (e) {
        throw new Error("❌ Invalid input. Provide batch ID, QR data file path, or QR JSON data");
      }
    }
  } else {
    // If no argument provided, try to find the most recent QR data file
    const qrDirectory = path.join(__dirname, "../qr-codes");
    if (fs.existsSync(qrDirectory)) {
      const qrFiles = fs.readdirSync(qrDirectory)
        .filter(file => file.endsWith('_qr_data.json'))
        .sort()
        .reverse();
      
      if (qrFiles.length > 0) {
        const latestQRFile = path.join(qrDirectory, qrFiles[0]);
        console.log("📄 Using most recent QR data file:", latestQRFile);
        qrData = JSON.parse(fs.readFileSync(latestQRFile, "utf8"));
        batchId = qrData.batchId;
      } else {
        throw new Error("❌ No QR data files found. Please provide batch ID or QR data");
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
  
  // Verify QR data contract address matches deployed contract
  if (qrData && qrData.contractAddress !== deployment.contractAddress) {
    console.warn("⚠️  Warning: QR contract address doesn't match current deployment");
    console.log("   QR Contract:", qrData.contractAddress);
    console.log("   Current Contract:", deployment.contractAddress);
  }

  // Get signers - use the second account as manufacturer
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer] = signers;
  
  console.log("👤 Updating with manufacturer:", manufacturer.address);

  // Connect to the deployed contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(deployment.contractAddress);

  // Verify manufacturer role
  const isManufacturer = await supplyChain.manufacturers(manufacturer.address);
  if (!isManufacturer) {
    throw new Error("❌ Account is not registered as manufacturer. Please run: npm run setup-roles");
  }
  
  console.log("✅ Manufacturer role verified");

  // Get current batch data
  try {
    const batchData = await supplyChain.getBatch(batchId);
    console.log("\n📊 Current Batch Status:");
    console.log("   Batch ID:", batchData.batchId.toString());
    console.log("   Product:", batchData.productName);
    console.log("   Manufacturer:", batchData.manufacturer);
    console.log("   Status:", Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale");
    console.log("   Supplier:", batchData.supplier === hre.ethers.ZeroAddress ? "Not assigned" : batchData.supplier);
    console.log("   Last Updated:", new Date(Number(batchData.timestamp) * 1000).toLocaleString());

    // Verify manufacturer owns this batch
    if (batchData.manufacturer.toLowerCase() !== manufacturer.address.toLowerCase()) {
      throw new Error(`❌ You are not the manufacturer of this batch. Batch manufacturer: ${batchData.manufacturer}`);
    }

    // For this demonstration, we'll show what updates are possible
    console.log("\n🔄 Available Updates for Manufacturers:");
    console.log("   1. View batch details (completed above)");
    console.log("   2. Generate updated QR code");
    console.log("   3. Export batch data");
    
    if (Number(batchData.status) === 0) {
      console.log("   4. Note: Batch status can be updated by suppliers via: npm run mark-ready");
    } else {
      console.log("   4. ✅ Batch is already marked as 'Ready for Sale'");
    }

    // Generate updated QR code with current timestamp
    console.log("\n🔲 Generating updated QR Code...");
    const qrDirectory = path.join(__dirname, "../qr-codes");
    
    if (!fs.existsSync(qrDirectory)) {
      fs.mkdirSync(qrDirectory, { recursive: true });
    }

    const updatedQrData = {
      batchId: Number(batchData.batchId),
      productName: batchData.productName,
      manufacturer: batchData.manufacturer,
      supplier: batchData.supplier === hre.ethers.ZeroAddress ? null : batchData.supplier,
      status: Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale",
      contractAddress: deployment.contractAddress,
      network: hre.network.name,
      lastUpdated: new Date().toISOString(),
      originalCreationTime: new Date(Number(batchData.timestamp) * 1000).toISOString(),
      verificationUrl: `https://etherscan.io/address/${deployment.contractAddress}`
    };

    // Generate updated QR code
    const qrFileName = `batch_${batchId}_updated_qr.png`;
    const qrFilePath = path.join(qrDirectory, qrFileName);
    
    await QRCode.toFile(qrFilePath, JSON.stringify(updatedQrData), {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log("✅ Updated QR Code generated:", qrFilePath);
    
    // Display QR code in terminal
    const qrString = await QRCode.toString(JSON.stringify(updatedQrData), {
      type: 'terminal',
      width: 50
    });
    
    console.log("\n📱 Updated QR Code (scan with your device):");
    console.log(qrString);
    
    // Save updated QR data
    const qrDataFileName = `batch_${batchId}_updated_qr_data.json`;
    const qrDataFilePath = path.join(qrDirectory, qrDataFileName);
    fs.writeFileSync(qrDataFilePath, JSON.stringify(updatedQrData, null, 2));
    console.log("📄 Updated QR data saved:", qrDataFilePath);

    console.log("\n🎉 Batch update completed!");
    console.log("💡 QR code now contains the latest batch information");

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
    console.error("❌ QR batch update failed:", error);
    process.exit(1);
  });