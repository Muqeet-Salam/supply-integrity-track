const { execSync } = require("child_process");
const path = require("path");

// Get product name from command line arguments
const productName = process.argv.slice(2).join(" ");

if (!productName) {
  console.error("❌ Product name is required!");
  console.log('💡 Usage: npm run create-batch "Product Name"');
  console.log(
    '💡 Example: npm run create-batch "Premium Coffee Beans - Colombian"',
  );
  process.exit(1);
}

try {
  // Set environment variable for the product name to avoid argument parsing issues
  process.env.PRODUCT_NAME = productName;

  // Run the actual Hardhat script
  const command = "npx hardhat run scripts/createBatch.js --network localhost";
  console.log(`🔄 Creating batch for: "${productName}"`);

  execSync(command, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."), // Go to blockchain directory
  });

  // --- AUTOMATIC QR CODE UPLOAD ---
  // Find the latest batch_X_live_qr_data.json and .png
  const fs = require("fs");
  const qrDir = path.join(__dirname, "..", "qr-codes");
  const files = fs
    .readdirSync(qrDir)
    .filter((f) => f.endsWith("_live_qr_data.json"));
  if (files.length > 0) {
    // Sort by batch number descending
    files.sort((a, b) => {
      const aNum = parseInt(a.match(/batch_(\d+)_/)[1], 10);
      const bNum = parseInt(b.match(/batch_(\d+)_/)[1], 10);
      return bNum - aNum;
    });
    const latestJson = files[0];
    const batchNum = latestJson.match(/batch_(\d+)_/)[1];
    const latestPng = `batch_${batchNum}_live_qr.png`;
    const jsonPath = path.join(qrDir, latestJson);
    const pngPath = path.join(qrDir, latestPng);
    if (fs.existsSync(jsonPath) && fs.existsSync(pngPath)) {
      console.log(`⬆️  Uploading QR code for batch ${batchNum} to backend...`);
      execSync(
        `node scripts/uploadQrToBackend.js qr-codes/${latestJson} qr-codes/${latestPng}`,
        { stdio: "inherit", cwd: path.join(__dirname, "..") },
      );
    } else {
      console.warn(
        "⚠️  Could not find both JSON and PNG for latest batch. Skipping upload.",
      );
    }
  } else {
    console.warn("⚠️  No QR code JSON files found for upload.");
  }
} catch (error) {
  console.error("❌ Batch creation failed:", error.message);
  process.exit(1);
}
