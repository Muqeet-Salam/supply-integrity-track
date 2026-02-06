#!/usr/bin/env node

/**
 * Standalone QR Code Scanner/Reader for Supply Chain Batches
 * Usage: node utils/scanQR.js [qr_data_file.json]
 */

const fs = require('fs');
const path = require('path');

async function scanQR() {
  console.log("📱 Supply Chain QR Code Scanner\n");

  let qrDataFile;
  
  if (process.argv[2]) {
    // QR data file provided
    qrDataFile = process.argv[2];
    
    // Check if it's a relative path
    if (!path.isAbsolute(qrDataFile)) {
      qrDataFile = path.join(process.cwd(), qrDataFile);
    }
    
    if (!fs.existsSync(qrDataFile)) {
      console.error(`❌ QR data file not found: ${qrDataFile}`);
      process.exit(1);
    }
  } else {
    // Look for QR files in qr-codes directory
    const qrDirectory = path.join(__dirname, "../qr-codes");
    
    if (!fs.existsSync(qrDirectory)) {
      console.error("❌ No QR codes directory found.");
      console.log("💡 Generate QR codes first: npm run generate-qr [batchId]");
      process.exit(1);
    }
    
    const qrFiles = fs.readdirSync(qrDirectory)
      .filter(file => file.endsWith('_qr_data.json'))
      .sort()
      .reverse(); // Most recent first
    
    if (qrFiles.length === 0) {
      console.error("❌ No QR data files found.");
      console.log("💡 Generate QR codes first: npm run generate-qr [batchId]");
      process.exit(1);
    }
    
    console.log("📋 Available QR Data Files:");
    qrFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    
    qrDataFile = path.join(qrDirectory, qrFiles[0]);
    console.log(`\n📄 Using most recent: ${qrFiles[0]}`);
  }

  try {
    // Read and parse QR data
    const qrData = JSON.parse(fs.readFileSync(qrDataFile, 'utf8'));
    
    console.log("\n═══════════════════════════════════════════");
    console.log("📱 QR CODE SCAN RESULTS");
    console.log("═══════════════════════════════════════════");
    
    console.log("🆔 Batch ID:", qrData.batchId);
    console.log("🔗 Contract:", qrData.contractAddress);
    console.log("🌐 Network:", qrData.network);
    console.log("📅 Generated:", new Date(qrData.createdAt || qrData.updatedAt || qrData.generatedAt).toLocaleString());
    
    if (qrData.productName) {
      console.log("📦 Product:", qrData.productName);
    }
    if (qrData.manufacturer) {
      console.log("🏭 Manufacturer:", qrData.manufacturer);
    }
    if (qrData.supplier) {
      console.log("🏪 Supplier:", qrData.supplier);
    }
    if (qrData.status) {
      console.log("📊 Status:", qrData.status);
    }
    
    console.log("\n🔐 QR Verification:");
    console.log("   Type:", qrData.type || 'Unknown');
    // Show verification URL based on network
    let verificationUrl = qrData.verificationUrl;
    if (qrData.network === 'localhost') {
      verificationUrl = `Local network - Contract: ${qrData.contractAddress}`;
    }
    console.log("   Verification URL:", verificationUrl || 'N/A');
    
    // Validate QR data structure
    const isValid = qrData.batchId !== undefined && 
                   qrData.contractAddress && 
                   (qrData.createdAt || qrData.updatedAt || qrData.generatedAt);
    
    console.log("\n✅ QR Data Status:", isValid ? "VALID" : "INVALID");
    
    if (!isValid) {
      console.log("⚠️  This QR code appears to be corrupted or invalid.");
    }
    
    console.log("\n💡 Next steps:");
    console.log(`   • View full history: npm run batch-qr-history ${qrData.batchId}`);
    console.log(`   • Update QR: npm run generate-qr ${qrData.batchId}`);
    console.log("   • Verify on blockchain: npm run view-history");
    
  } catch (error) {
    console.error("❌ QR scan failed:", error.message);
    
    if (error.message.includes('JSON')) {
      console.log("💡 This might not be a valid QR data file.");
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  scanQR().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });
}

module.exports = { scanQR };