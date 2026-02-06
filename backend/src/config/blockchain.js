import { ethers } from "ethers";
import dotenv from "dotenv";
import abi from "../../abi/SUpplyChain.json" assert { type: "json" };

dotenv.config();

export const provider = new ethers.JsonRpcApiProvider(process.env.RPC_URL);
export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  provider
);
