import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";

export default defineConfig({
  solidity: "0.8.20",
  networks: {
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    },
  },
});
