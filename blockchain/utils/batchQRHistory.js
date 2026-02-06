#!/usr/bin/env node

/**
 * QR-Enhanced Batch History Viewer
 * Usage: node utils/batchQRHistory.js [batchId]
 */

const fs = require('fs');
const path = require('path');

async function viewQRHistory() {
  console.log("🔍 QR-Enhanced Batch History Viewer\n");

  let batchId;
  let qrData = null;

  // Get batch ID from command line
  if (process.argv[2]) {
    batchId = parseInt(process.argv[2]);
    if (isNaN(batchId)) {
      console.error("❌ Invalid batch ID. Please provide a number.");
      process.exit(1);
    }
  } else {
    console.error("❌ Please provide a batch ID.");
    console.log("💡 Usage: npm run batch-qr-history [batchId]");
    console.log("💡 Example: npm run batch-qr-history 0");
    process.exit(1);
  }

  console.log("📦 Batch ID:", batchId);

  // Try to find QR data for this batch
  const qrDirectory = path.join(__dirname, "../qr-codes");
  const possibleQRFiles = [
    `batch_${batchId}_qr_data.json`,
    `batch_${batchId}_updated_qr_data.json`
  ];

  for (const fileName of possibleQRFiles) {
    const qrFilePath = path.join(qrDirectory, fileName);
    if (fs.existsSync(qrFilePath)) {
      try {
        qrData = JSON.parse(fs.readFileSync(qrFilePath, 'utf8'));
        console.log("📱 Found QR data:", fileName);
        break;
      } catch (error) {
        console.warn(`⚠️  Could not read QR file ${fileName}: ${error.message}`);
      }
    }
  }

  if (!qrData) {
    console.log("📱 No QR data found for this batch.");
    console.log("💡 Generate QR first: npm run generate-qr", batchId);
  }

  // Check deployment info
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ deployment.json not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

  console.log("\n═══════════════════════════════════════════");
  console.log(`📊 BATCH ${batchId} - QR ENHANCED HISTORY`);
  console.log("═══════════════════════════════════════════");

  // Display QR Information if available
  if (qrData) {
    console.log("\n📱 QR Code Information:");
    console.log("   🆔 Batch ID:", qrData.batchId);
    console.log("   📅 QR Generated:", new Date(qrData.generatedAt).toLocaleString());
    
    if (qrData.productName) {
      console.log("   📦 Product:", qrData.productName);
    }
    if (qrData.manufacturer) {
      console.log("   🏭 Manufacturer:", qrData.manufacturer);
    }
    if (qrData.supplier) {
      console.log("   🏪 Supplier:", qrData.supplier);
    }
    if (qrData.status) {
      console.log("   📊 Status:", qrData.status);
    }
    
    // Verify QR matches deployment
    if (qrData.contractAddress !== deployment.contractAddress) {
      console.log("   ⚠️  WARNING: QR contract address doesn't match current deployment");
      console.log("       QR Contract:", qrData.contractAddress);
      console.log("       Current Contract:", deployment.contractAddress);
    } else {
      console.log("   ✅ QR contract address verified");
    }
  }

  // Display deployment info
  console.log("\n🔗 Blockchain Information:");
  console.log("   📄 Contract:", deployment.contractAddress);
  console.log("   🌐 Network:", deployment.network);
  console.log("   📅 Deployed:", new Date(deployment.deployedAt).toLocaleString());
  console.log("   👤 Deployer:", deployment.deployer);

  // Show account info
  console.log("\n👥 Account Setup:");
  console.log("   🏭 Manufacturer:", deployment.manufacturer);
  console.log("   🏪 Supplier:", deployment.supplier);
  console.log("   👤 User:", deployment.user);

  // Instructions for blockchain verification
  console.log("\n🔍 Blockchain Verification:");
  console.log("   To view live blockchain data for this batch:");
  console.log(`   → npm run view-history ${batchId}`);
  
  if (qrData) {
    console.log("\n📱 QR Code Management:");
    console.log(`   → Update QR: npm run generate-qr ${batchId}`);
    console.log(`   → Scan QR: npm run scan-qr qr-codes/batch_${batchId}_qr_data.json`);
  } else {
    console.log("\n📱 QR Code Generation:");
    console.log(`   → Generate QR: npm run generate-qr ${batchId}`);
  }

  // Summary
  console.log("\n═══════════════════════════════════════════");
  console.log("📊 Summary:");
  console.log(`   🆔 Batch ID: ${batchId}`);
  console.log(`   📱 QR Available: ${qrData ? '✅ Yes' : '❌ No'}`);
  console.log(`   🔗 Contract: ${deployment.contractAddress.substring(0, 10)}...`);
  
  if (qrData) {
    const qrAge = (Date.now() - new Date(qrData.generatedAt).getTime()) / (1000 * 60);
    console.log(`   📅 QR Age: ${qrAge.toFixed(1)} minutes`);
    
    if (qrAge > 60) {
      console.log("   💡 Consider updating QR code for latest batch status");
    }
  }

  console.log("\n🎉 QR history analysis completed!");
}

// Run if called directly
if (require.main === module) {
  viewQRHistory().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });
}

module.exports = { viewQRHistory };