const { execSync } = require('child_process');
const path = require('path');

// Get batch ID from command line arguments (optional)
const batchId = process.argv[2];

try {
  // Set environment variable for the batch ID if provided
  if (batchId) {
    process.env.BATCH_ID = batchId;
    console.log(`🎯 Marking batch ${batchId} ready for sale...`);
  } else {
    console.log("🏪 Marking most recent batch ready for sale...");
  }
  
  // Run the actual Hardhat script
  const command = 'npx hardhat run scripts/markReadyForSale.js --network localhost';
  
  execSync(command, { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..') // Go to blockchain directory
  });
  
} catch (error) {
  console.error("❌ Mark ready failed:", error.message);
  process.exit(1);
}