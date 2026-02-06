const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Standalone QR Code Generator for Supply Chain Batches
async function generateQRForBatch(batchData, outputDir = './qr-codes') {
  try {
    // Create QR codes directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const qrData = {
      batchId: batchData.batchId,
      productName: batchData.productName,
      manufacturer: batchData.manufacturer,
      supplier: batchData.supplier || null,
      status: batchData.status,
      contractAddress: batchData.contractAddress,
      network: batchData.network || 'localhost',
      createdAt: batchData.createdAt || new Date().toISOString(),
      verificationUrl: `https://etherscan.io/address/${batchData.contractAddress}`
    };

    // Generate QR code as PNG file
    const qrFileName = `batch_${batchData.batchId}_qr.png`;
    const qrFilePath = path.join(outputDir, qrFileName);
    
    await QRCode.toFile(qrFilePath, JSON.stringify(qrData), {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log("✅ QR Code generated:", qrFilePath);
    
    // Generate QR code as text (for terminal display)
    const qrString = await QRCode.toString(JSON.stringify(qrData), {
      type: 'terminal',
      width: 50
    });
    
    console.log("\n📱 QR Code (scan with your device):");
    console.log(qrString);
    
    // Save QR data as JSON for reference
    const qrDataFileName = `batch_${batchData.batchId}_qr_data.json`;
    const qrDataFilePath = path.join(outputDir, qrDataFileName);
    fs.writeFileSync(qrDataFilePath, JSON.stringify(qrData, null, 2));
    console.log("📄 QR data saved:", qrDataFilePath);
    
    return {
      qrFilePath,
      qrDataFilePath,
      qrData
    };
    
  } catch (error) {
    console.error("⚠️  QR Code generation failed:", error.message);
    throw error;
  }
}

module.exports = { generateQRForBatch };