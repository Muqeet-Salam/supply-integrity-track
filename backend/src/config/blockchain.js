import { ethers } from "ethers";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const deployment = require("../../../blockchain/deployment.json");
const SupplyChainArtifact = require(
	"../../../blockchain/artifacts/contracts/SupplyChain.sol/SupplyChain.json"
);

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";

export const provider = new ethers.JsonRpcProvider(RPC_URL);

const baseContract = new ethers.Contract(
	deployment.contractAddress,
	SupplyChainArtifact.abi,
	provider
);

function getWalletFromEnv(envVar) {
	const pk = process.env[envVar];
	if (!pk) return null;
	return new ethers.Wallet(pk, provider);
}

const manufacturerWallet = getWalletFromEnv("MANUFACTURER_PRIVATE_KEY");
const supplierWallet = getWalletFromEnv("SUPPLIER_PRIVATE_KEY");

export const contract = baseContract;

export function getManufacturerContract() {
	if (manufacturerWallet) {
		return baseContract.connect(manufacturerWallet);
	}

	// Fall back to using JSON-RPC unlocked account signer (Hardhat node)
	try {
		const signer = provider.getSigner(deployment.manufacturer);
		return baseContract.connect(signer);
	} catch (err) {
		throw new Error("MANUFACTURER_PRIVATE_KEY not set and provider signer unavailable");
	}
}

export function getSupplierContract() {
	if (supplierWallet) {
		return baseContract.connect(supplierWallet);
	}

	try {
		const signer = provider.getSigner(deployment.supplier);
		return baseContract.connect(signer);
	} catch (err) {
		throw new Error("SUPPLIER_PRIVATE_KEY not set and provider signer unavailable");
	}
}

export const addresses = {
	contract: deployment.contractAddress,
	manufacturer: deployment.manufacturer,
	supplier: deployment.supplier,
};
