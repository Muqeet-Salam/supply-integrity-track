const { execSync } = require('child_process');
const path = require('path');

// Get product name from command line arguments
const productName = process.argv.slice(2).join(' ');

if (!productName) {
  console.error("❌ Product name is required!");
  console.log("💡 Usage: npm run create-batch \"Product Name\"");
  console.log("💡 Example: npm run create-batch \"Premium Coffee Beans - Colombian\"");
  process.exit(1);
}

try {
  // Set environment variable for the product name to avoid argument parsing issues
  process.env.PRODUCT_NAME = productName;
  
  // Run the actual Hardhat script
  const command = 'npx hardhat run scripts/createBatch.js --network localhost';
  console.log(`🔄 Creating batch for: "${productName}"`);
  
  execSync(command, { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..') // Go to blockchain directory
  });
  
} catch (error) {
  console.error("❌ Batch creation failed:", error.message);
  process.exit(1);
}