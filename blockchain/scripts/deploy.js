const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...\n");
  
  // Get signers
  const signers = await hre.ethers.getSigners();
  const [deployer, manufacturer, supplier, ...users] = signers;

  console.log("Deploying contracts with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", (Number(balance) / 1e18).toFixed(4), "ETH\n");

  // Deploy SupplyChain contract
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  console.log("📦 Deploying SupplyChain contract...");
  const supplyChain = await SupplyChain.deploy();

  const contractAddress = supplyChain.address;
  console.log("✅ SupplyChain deployed to:", contractAddress);

  // Save contract address and account info to a file for other scripts
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    manufacturer: manufacturer.address,
    supplier: supplier.address,
    user: users[0].address,
    deployedAt: new Date().toISOString(),
    network: hre.network.name
  };

  const deploymentPath = path.join(__dirname, "../deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n📄 Deployment info saved to:", deploymentPath);
  console.log("\n🔧 Account Setup:");
  console.log("- Deployer (Owner):", deployer.address);
  console.log("- Manufacturer:", manufacturer.address);
  console.log("- Supplier:", supplier.address);
  console.log("- User:", users[0].address);
  
  console.log("\n✨ Deployment completed successfully!");
  console.log("💡 Next steps:");
  console.log("   1. Run: npm run setup-roles");
  console.log("   2. Run: npm run create-batch");
  console.log("   3. Run: npm run mark-ready");
  console.log("   4. Run: npm run view-history");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
