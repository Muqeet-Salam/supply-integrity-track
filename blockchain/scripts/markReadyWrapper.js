const { execSync } = require("child_process");
const path = require("path");

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
  const command =
    "npx hardhat run scripts/markReadyForSale.js --network localhost";

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
  console.error("❌ Mark ready failed:", error.message);
  process.exit(1);
}
