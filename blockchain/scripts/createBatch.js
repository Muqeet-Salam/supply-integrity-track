const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("📦 Creating a new batch...\n");

  // Get product name from environment variable (set by wrapper script)
  const productName = process.env.PRODUCT_NAME || process.argv[2];
  if (!productName) {
    console.error("❌ Product name is required!");
    console.log('💡 Usage: npm run create-batch "Product Name"');
    console.log(
      '💡 Example: npm run create-batch "Premium Coffee Beans - Colombian"',
    );
    process.exit(1);
  }

  console.log("🏷️ Product Name:", productName);

  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(
      "❌ deployment.json not found. Please run deployment first: npm run deploy",
    );
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("📄 Contract address:", deployment.contractAddress);

  // Get signers - use the second account as manufacturer
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer] = signers;

  console.log("👤 Creating batch with manufacturer:", manufacturer.address);

  // Connect to the deployed contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(deployment.contractAddress);

  // Verify manufacturer role
  const isManufacturer = await supplyChain.manufacturers(manufacturer.address);
  if (!isManufacturer) {
    throw new Error(
      "❌ Account is not registered as manufacturer. Please run: npm run setup-roles",
    );
  }

  console.log("✅ Manufacturer role verified");

  // Get current batch ID before creating
  const currentBatchId = await supplyChain.getCurrentBatchId();
  console.log("🔢 Current batch ID:", currentBatchId.toString());

  // Create a new batch
  console.log("🏭 Creating batch for product:", productName);

  const tx = await supplyChain.connect(manufacturer).createBatch(productName);
  console.log("⏳ Transaction sent, waiting for confirmation...");

  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

  // Get the new batch ID
  const newBatchId = await supplyChain.getCurrentBatchId();
  const createdBatchId = Number(newBatchId) - 1; // The ID of the batch we just created

  console.log("🏭 New batch created!");
  console.log("   Batch ID:", createdBatchId.toString());
  console.log("   Product:", productName);
  console.log("   Manufacturer:", manufacturer.address);

  // Get and display the batch data
  const batchData = await supplyChain.getBatch(createdBatchId);
  console.log("\n📊 Batch Details:");
  console.log("   ID:", batchData.batchId.toString());
  console.log("   Product Name:", batchData.productName);
  console.log("   Manufacturer:", batchData.manufacturer);
  console.log(
    "   Supplier:",
    batchData.supplier === hre.ethers.ZeroAddress
      ? "Not assigned"
      : batchData.supplier,
  );
  console.log(
    "   Status:",
    Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale",
  );
  console.log(
    "   Created:",
    new Date(Number(batchData.timestamp) * 1000).toLocaleString(),
  );

  console.log("\n🔲 Generating QR code for batch...");

  // Auto-generate QR code and POST directly to backend
  try {
    const QRCode = require("qrcode");
    const axios = require("axios");
    const FormData = require("form-data");

    // Prepare QR data
    const qrData = {
      batchId: createdBatchId,
      contractAddress: deployment.contractAddress,
      network: deployment.network || "localhost",
      productName: batchData.productName,
      manufacturer: batchData.manufacturer,
      supplier: batchData.supplier,
      status:
        Number(batchData.status) === 0 ? "Manufactured" : "Ready for Sale",
      createdAt: new Date(Number(batchData.timestamp) * 1000).toISOString(),
      verificationUrl:
        deployment.network === "localhost"
          ? `Localhost network - Contract: ${deployment.contractAddress}`
          : `https://etherscan.io/address/${deployment.contractAddress}`,
      type: "supply-chain-batch-created",
    };

    // Generate QR code image as buffer
    const qrImageBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    // Prepare form data
    const form = new FormData();
    form.append("json", Buffer.from(JSON.stringify(qrData)), {
      filename: `batch_${createdBatchId}_live_qr_data.json`,
      contentType: "application/json",
    });
    form.append("image", qrImageBuffer, {
      filename: `batch_${createdBatchId}_live_qr.png`,
      contentType: "image/png",
    });

    // POST to backend
    const BACKEND_URL =
      process.env.BACKEND_URL ||
      "http://localhost:5000/api/batches/qr-codes/upload";
    const response = await axios.post(BACKEND_URL, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    console.log("✅ QR Code generated and uploaded to backend!");
    console.log(response.data);
  } catch (qrError) {
    console.warn(
      "⚠️ QR generation/upload failed, but batch was created successfully:",
      qrError.message,
    );
  }

  console.log("\n🎉 Batch creation completed!");
  console.log("💡 Next step: npm run mark-ready");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Batch creation failed:", error);
    process.exit(1);
  });
