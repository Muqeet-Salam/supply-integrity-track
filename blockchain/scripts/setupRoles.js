const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔧 Setting up roles...\n");
  
  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("❌ deployment.json not found. Please run deployment first: npm run deploy");
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("📄 Contract address:", deployment.contractAddress);
  
  // Get signers
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer, supplier, user] = signers;
  
  // Verify the accounts match deployment info
  console.log("👤 Accounts:");
  console.log("   Deployer (Owner):", deployer.address);
  console.log("   Manufacturer:    ", manufacturer.address);
  console.log("   Supplier:        ", supplier.address);
  console.log("   User:            ", user.address);
  console.log();

  // Connect to the deployed contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(deployment.contractAddress);

  // Check initial roles
  console.log("🔍 Checking initial roles...");
  const isDeployerManufacturer = await supplyChain.manufacturers(deployer.address);
  const isManufacturerRole = await supplyChain.manufacturers(manufacturer.address);
  const isSupplierRole = await supplyChain.suppliers(supplier.address);
  
  console.log("   Deployer is manufacturer:", isDeployerManufacturer);
  console.log("   Account[1] is manufacturer:", isManufacturerRole);
  console.log("   Account[2] is supplier:", isSupplierRole);
  console.log();

  // Add manufacturer role (if not already added)
  if (!isManufacturerRole) {
    console.log("➕ Adding manufacturer role to account[1]...");
    const tx1 = await supplyChain.connect(deployer).addManufacturer(manufacturer.address);
    await tx1.wait();
    console.log("✅ Manufacturer role added!");
  } else {
    console.log("ℹ️  Manufacturer role already exists for account[1]");
  }

  // Add supplier role (if not already added)
  if (!isSupplierRole) {
    console.log("➕ Adding supplier role to account[2]...");
    const tx2 = await supplyChain.connect(deployer).addSupplier(supplier.address);
    await tx2.wait();
    console.log("✅ Supplier role added!");
  } else {
    console.log("ℹ️  Supplier role already exists for account[2]");
  }

  // Verify roles are set
  console.log("\n🔍 Final role verification:");
  const finalManufacturer = await supplyChain.manufacturers(manufacturer.address);
  const finalSupplier = await supplyChain.suppliers(supplier.address);
  
  console.log("   Manufacturer role active:", finalManufacturer ? "✅" : "❌");
  console.log("   Supplier role active:", finalSupplier ? "✅" : "❌");
  
  if (finalManufacturer && finalSupplier) {
    console.log("\n🎉 All roles configured successfully!");
    console.log("💡 Ready to create and manage batches");
  } else {
    throw new Error("❌ Role setup failed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Role setup failed:", error);
    process.exit(1);
  });