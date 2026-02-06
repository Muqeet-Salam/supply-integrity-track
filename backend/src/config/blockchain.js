import { ethers } from "ethers";

const RPC_URL = process.env.RPC_URL || "http://localhost:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const ABI = [
  // Minimal ABI for event listening
  "event BatchCreated(uint256 batchId, string productName, address manufacturer, address supplier, uint8 status, uint256 timestamp)",
  "event Transfer(uint256 batchId, address from, address to, uint256 timestamp)",
];

export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const contract = CONTRACT_ADDRESS
  ? new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
  : null;
