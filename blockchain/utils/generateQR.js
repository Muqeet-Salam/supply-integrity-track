#!/usr/bin/env node

/**
 * Standalone QR Code Generator for Supply Chain Batches
 * Usage: node utils/generateQR.js [batchId]
 * If no batchId provided, generates QR for the most recent batch
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQRForBatch() {
  console.log("🔲 Supply Chain QR Code Generator\n");

  // Get batch ID from command line or use most recent
  let batchId;
  if (process.argv[2]) {
    batchId = parseInt(process.argv[2]);
    if (isNaN(batchId)) {
      console.error("❌ Invalid batch ID. Please provide a number.");
      process.exit(1);
    }
  } else {
    // Try to find most recent batch from deployment.json
    const deploymentPath = path.join(__dirname, "../deployment.json");
    if (!fs.existsSync(deploymentPath)) {
      console.error("❌ No deployment.json found. Please deploy contracts first.");
      process.exit(1);
    }

    console.log("📦 No batch ID provided. Checking for most recent batch...");
    // For now, ask user to provide batch ID
    console.log("💡 Usage: npm run generate-qr [batchId]");
    console.log("💡 Example: npm run generate-qr 0");
    process.exit(1);
  }

  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ deployment.json not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  console.log("📄 Contract:", deployment.contractAddress);
  console.log("📦 Generating QR for Batch ID:", batchId);

  // Create QR codes directory
  const qrDirectory = path.join(__dirname, "../qr-codes");
  if (!fs.existsSync(qrDirectory)) {
    fs.mkdirSync(qrDirectory, { recursive: true });
  }

  // Create QR data (simplified for standalone usage)
  const qrData = {
    batchId: batchId,
    contractAddress: deployment.contractAddress,
    network: deployment.network || 'localhost',
    generatedAt: new Date().toISOString(),
    verificationUrl: `https://etherscan.io/address/${deployment.contractAddress}`,
    scanInstructions: "Use 'npm run scan-qr' to read this QR code",
    type: "supply-chain-batch"
  };

  try {
    // Generate QR code as PNG file
    const qrFileName = `batch_${batchId}_qr.png`;
    const qrFilePath = path.join(qrDirectory, qrFileName);
    
    await QRCode.toFile(qrFilePath, JSON.stringify(qrData), {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log("✅ QR Code saved:", qrFilePath);
    
    // Generate terminal QR code
    const qrString = await QRCode.toString(JSON.stringify(qrData), {
      type: 'terminal',
      width: 60
    });
    
    console.log("\n📱 QR Code (scan with your mobile device):");
    console.log(qrString);
    
    // Save QR data as JSON
    const qrDataFileName = `batch_${batchId}_qr_data.json`;
    const qrDataFilePath = path.join(qrDirectory, qrDataFileName);
    fs.writeFileSync(qrDataFilePath, JSON.stringify(qrData, null, 2));
    console.log("\n📄 QR data saved:", qrDataFilePath);
    
    console.log("\n🎉 QR Code generation completed!");
    console.log("💡 To scan/read QR: npm run scan-qr", qrDataFileName);
    console.log("💡 To view batch history: npm run batch-qr-history", batchId);

  } catch (error) {
    console.error("❌ QR generation failed:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateQRForBatch().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });
}

module.exports = { generateQRForBatch };