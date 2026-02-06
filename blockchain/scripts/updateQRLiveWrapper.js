const { execSync } = require('child_process');
const path = require('path');

// Get batch ID from command line arguments
const batchId = process.argv[2];

if (!batchId) {
  console.error("❌ Batch ID is required!");
  console.log("💡 Usage: npm run update-qr-live [batchId]");
  console.log("💡 Example: npm run update-qr-live 0");
  process.exit(1);
}

try {
  // Set environment variable for the batch ID
  process.env.BATCH_ID = batchId;
  
  // Run the actual Hardhat script
  const command = 'npx hardhat run scripts/updateQRLive.js --network localhost';
  console.log(`🔄 Updating QR for batch: ${batchId}`);
  
  execSync(command, { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..') // Go to blockchain directory
  });
  
} catch (error) {
  console.error("❌ QR update failed:", error.message);
  process.exit(1);
}