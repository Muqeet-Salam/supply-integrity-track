import hre from "hardhat";

async function main() {
  const walletClient = await hre.viem.getWalletClient();

  const contract = await hre.viem.deployContract(
    "SupplyChain",
    [],
    { walletClient }
  );

  console.log("SupplyChain deployed at:", contract.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
