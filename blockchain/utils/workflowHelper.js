const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');

function showHelp() {
  console.log(`
🔄 Supply Chain Workflow Helper

📖 Complete Workflow:

1️⃣  CREATE BATCH (with product name):
   npm run create-batch "Product Name"
   Example: npm run create-batch "Premium Coffee Beans - Colombian"
   
   ✅ This automatically:
   • Creates batch on blockchain
   • Generates live QR code
   • Shows QR file location

2️⃣  SCAN QR (to get batch info):
   npm run scan-qr qr-codes/batch_X_live_qr_data.json
   
   ✅ Shows:
   • Batch ID and status
   • Contract address
   • Product details

3️⃣  MARK READY FOR SALE:
   npm run mark-ready [batchId]
   Example: npm run mark-ready 0
   
   💡 Or scan QR first to get batch ID

4️⃣  VIEW HISTORY:
   npm run view-history [batchId]  
   Example: npm run view-history 0

🔍 QR Operations:
   • Generate new QR: npm run update-qr-live [batchId]
   • Scan QR: npm run scan-qr [qrFile]
   • QR history: npm run batch-qr-history [batchId]

📁 QR Files Location: qr-codes/
   • batch_X_live_qr.png (QR image)
   • batch_X_live_qr_data.json (QR data)

💡 Quick Examples:

Create batch: npm run create-batch "Organic Tea - Earl Grey"
Scan QR: npm run scan-qr qr-codes/batch_0_live_qr_data.json
Mark ready: npm run mark-ready 0
View history: npm run view-history 0
`);
}

function listAvailableQRs() {
  const qrDir = path.join(__dirname, '../qr-codes');
  
  if (!fs.existsSync(qrDir)) {
    console.log("📂 No QR codes directory found. Create a batch first!");
    return [];
  }

  const files = fs.readdirSync(qrDir);
  const qrFiles = files.filter(file => file.endsWith('_qr_data.json'));
  
  if (qrFiles.length === 0) {
    console.log("📱 No QR data files found. Create a batch first!");
    return [];
  }

  console.log(`📱 Available QR Files (${qrFiles.length} found):`);
  console.log("─".repeat(50));
  
  qrFiles.forEach((file, index) => {
    const filePath = path.join(qrDir, file);
    const stats = fs.statSync(filePath);
    const batchId = file.match(/batch_(\d+)/)?.[1] || "?";
    
    console.log(`${index + 1}. Batch ${batchId}: ${file}`);
    console.log(`   📅 Created: ${stats.mtime.toLocaleString()}`);
    console.log(`   💾 Size: ${(stats.size / 1024).toFixed(1)} KB`);
    
    // Try to read QR data to show status
    try {
      const qrData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (qrData.batchData && qrData.batchData.status !== undefined) {
        const statusText = qrData.batchData.status === "0" ? "Manufactured" : 
                          qrData.batchData.status === "1" ? "Ready for Sale" : 
                          `Status: ${qrData.batchData.status}`;
        console.log(`   📊 Status: ${statusText}`);
      }
    } catch (e) {
      console.log(`   ⚠️  Status: Cannot read QR data`);
    }
    
    console.log();
  });

  return qrFiles;
}

function scanAndExtractBatchId(qrFile) {
  try {
    const qrPath = qrFile.startsWith('qr-codes/') ? 
                   path.join(__dirname, '../', qrFile) : 
                   path.join(__dirname, '../qr-codes', qrFile);
    
    if (!fs.existsSync(qrPath)) {
      console.error(`❌ QR file not found: ${qrPath}`);
      return null;
    }

    const qrData = JSON.parse(fs.readFileSync(qrPath, 'utf8'));
    
    if (qrData.batchId !== undefined) {
      console.log(`📱 Extracted Batch ID: ${qrData.batchId}`);
      console.log(`📄 Contract: ${qrData.contractAddress}`);
      console.log(`🌐 Network: ${qrData.network}`);
      
      if (qrData.batchData) {
        console.log(`📊 Current Status: ${qrData.batchData.status === "0" ? "Manufactured" : "Ready for Sale"}`);
        console.log(`🏭 Manufacturer: ${qrData.batchData.manufacturer}`);
      }
      
      return qrData.batchId;
    }
    
    console.error("❌ No batch ID found in QR data");
    return null;
    
  } catch (error) {
    console.error(`❌ Error reading QR file: ${error.message}`);
    return null;
  }
}

// Main function
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'help':
    default:
      showHelp();
      break;
      
    case 'list-qr':
      listAvailableQRs();
      break;
      
    case 'scan':
      const qrFile = process.argv[3];
      if (!qrFile) {
        console.log("❌ Please specify QR file to scan");
        console.log("💡 Usage: npm run workflow-help scan batch_0_live_qr_data.json");
        return;
      }
      scanAndExtractBatchId(qrFile);
      break;
      
    case 'quick-scan':
      // Scan the most recent QR file
      const qrFiles = fs.readdirSync(path.join(__dirname, '../qr-codes'))
                        .filter(f => f.endsWith('_qr_data.json'))
                        .map(f => ({
                          name: f,
                          path: path.join(__dirname, '../qr-codes', f),
                          mtime: fs.statSync(path.join(__dirname, '../qr-codes', f)).mtime
                        }))
                        .sort((a, b) => b.mtime - a.mtime);
      
      if (qrFiles.length === 0) {
        console.log("📱 No QR files found. Create a batch first!");
        return;
      }
      
      console.log(`🔍 Scanning most recent QR: ${qrFiles[0].name}`);
      scanAndExtractBatchId(qrFiles[0].name);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  showHelp,
  listAvailableQRs,
  scanAndExtractBatchId
};