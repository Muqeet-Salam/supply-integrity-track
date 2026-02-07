# Smart Contract Integration Guide

This guide explains how to replace the mock contract service with your real Solidity smart contract.

## Step 1: Deploy Your Smart Contract

### Required Contract Functions

Your Solidity contract should implement these functions:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Batch {
        string batchId;
        string productName;
        uint256 batchSize;
        string location;
        address manufacturer;
        address currentHandler;
        string status;
        uint256 createdAt;
    }

    struct TransferEvent {
        address handler;
        string location;
        uint256 timestamp;
        string action;
    }

    mapping(string => Batch) public batches;
    mapping(string => TransferEvent[]) public batchHistory;

    event BatchCreated(string batchId, string productName, address manufacturer);
    event BatchTransferred(string batchId, address from, address to, string location);
    event ReceiptConfirmed(string batchId, address retailer, string location);

    function createBatch(
        string memory productName,
        uint256 batchSize,
        string memory location
    ) public returns (string memory) {
        string memory batchId = generateBatchId();
        
        batches[batchId] = Batch({
            batchId: batchId,
            productName: productName,
            batchSize: batchSize,
            location: location,
            manufacturer: msg.sender,
            currentHandler: msg.sender,
            status: "CREATED",
            createdAt: block.timestamp
        });

        batchHistory[batchId].push(TransferEvent({
            handler: msg.sender,
            location: location,
            timestamp: block.timestamp,
            action: "CREATED"
        }));

        emit BatchCreated(batchId, productName, msg.sender);
        return batchId;
    }

    function transferBatch(
        string memory batchId,
        address nextHandler,
        string memory location
    ) public {
        require(batches[batchId].currentHandler == msg.sender, "Not current handler");
        
        batches[batchId].currentHandler = nextHandler;
        batches[batchId].status = "IN_TRANSIT";

        batchHistory[batchId].push(TransferEvent({
            handler: nextHandler,
            location: location,
            timestamp: block.timestamp,
            action: "TRANSFERRED"
        }));

        emit BatchTransferred(batchId, msg.sender, nextHandler, location);
    }

    function confirmReceipt(
        string memory batchId,
        string memory location
    ) public {
        require(batches[batchId].currentHandler == msg.sender, "Not current handler");
        
        batches[batchId].status = "DELIVERED";

        batchHistory[batchId].push(TransferEvent({
            handler: msg.sender,
            location: location,
            timestamp: block.timestamp,
            action: "CONFIRMED"
        }));

        emit ReceiptConfirmed(batchId, msg.sender, location);
    }

    function getBatch(string memory batchId) public view returns (Batch memory) {
        return batches[batchId];
    }

    function getBatchHistory(string memory batchId) public view returns (TransferEvent[] memory) {
        return batchHistory[batchId];
    }

    function generateBatchId() private view returns (string memory) {
        return string(abi.encodePacked("BATCH-", block.timestamp));
    }
}
```

## Step 2: Get Contract ABI

After compiling your contract:

1. **Using Hardhat:**
   ```bash
   npx hardhat compile
   ```
   Find ABI in: `artifacts/contracts/SupplyChain.sol/SupplyChain.json`

2. **Using Remix:**
   - Compile your contract
   - Copy ABI from Compilation Details

3. **Save ABI:**
   Create `src/services/SupplyChainABI.json` with the ABI array

## Step 3: Update Contract Service

Replace `src/services/mockContract.js` with:

```javascript
import { ethers } from 'ethers';
import contractABI from './SupplyChainABI.json';
import { sleep } from '../utils/helpers';

class ContractService {
  constructor() {
    this.contract = null;
    this.initialized = false;
  }

  async initialize(provider, signer) {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    this.contract = new ethers.Contract(contractAddress, contractABI, signer);
    this.initialized = true;
    console.log('✅ Contract Initialized:', contractAddress);
    return true;
  }

  async createBatch(productName, batchSize, location) {
    if (!this.initialized) throw new Error('Contract not initialized');
    
    const tx = await this.contract.createBatch(productName, batchSize, location);
    const receipt = await tx.wait();
    
    // Extract batchId from event logs
    const event = receipt.logs.find(log => {
      try {
        return this.contract.interface.parseLog(log).name === 'BatchCreated';
      } catch { return false; }
    });
    
    const parsedLog = this.contract.interface.parseLog(event);
    const batchId = parsedLog.args.batchId;
    
    return {
      batchId,
      txHash: receipt.hash,
    };
  }

  async transferBatch(batchId, nextHandler, location) {
    if (!this.initialized) throw new Error('Contract not initialized');
    
    const tx = await this.contract.transferBatch(batchId, nextHandler, location);
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash,
    };
  }

  async confirmReceipt(batchId, location) {
    if (!this.initialized) throw new Error('Contract not initialized');
    
    const tx = await this.contract.confirmReceipt(batchId, location);
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash,
    };
  }

  async getBatch(batchId) {
    if (!this.initialized) throw new Error('Contract not initialized');
    
    const batch = await this.contract.getBatch(batchId);
    const history = await this.contract.getBatchHistory(batchId);
    
    return {
      batchId: batch.batchId,
      productName: batch.productName,
      batchSize: batch.batchSize.toString(),
      location: batch.location,
      manufacturer: batch.manufacturer,
      currentHandler: batch.currentHandler,
      status: batch.status,
      createdAt: batch.createdAt.toNumber() * 1000, // Convert to milliseconds
      history: history.map(event => ({
        handler: event.handler,
        location: event.location,
        timestamp: event.timestamp.toNumber() * 1000,
        action: event.action,
      }))
    };
  }

  async getBatchesByAddress(address) {
    // Implement using contract events or indexing
    const filter = this.contract.filters.BatchCreated(null, null, address);
    const events = await this.contract.queryFilter(filter);
    
    return Promise.all(
      events.map(event => this.getBatch(event.args.batchId))
    );
  }

  onBatchCreated(callback) {
    if (!this.contract) return;
    this.contract.on('BatchCreated', (batchId, productName, manufacturer, event) => {
      callback({ batchId, productName, manufacturer, event });
    });
  }

  onBatchTransferred(callback) {
    if (!this.contract) return;
    this.contract.on('BatchTransferred', (batchId, from, to, location, event) => {
      callback({ batchId, from, to, location, event });
    });
  }
}

export const contract = new ContractService();
```

## Step 4: Update Imports

In all files that import `mockContract`, change to:

```javascript
// Before:
import { mockContract } from '../services/mockContract';

// After:
import { contract } from '../services/contractService';
```

Update in these files:
- `src/context/AppContext.jsx`
- `src/pages/ManufacturerDashboard.jsx`
- `src/pages/DistributorDashboard.jsx`
- `src/pages/RetailerDashboard.jsx`
- `src/pages/ConsumerVerification.jsx`

## Step 5: Configure Environment

Update `.env`:

```env
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

## Step 6: Test Integration

1. **Deploy contract to testnet:**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Update .env with contract address**

3. **Test each function:**
   - Create batch
   - Transfer batch
   - Confirm receipt
   - Verify batch

## Step 7: Handle Gas Estimation

Add gas estimation for better UX:

```javascript
async createBatch(productName, batchSize, location) {
  // Estimate gas
  const gasEstimate = await this.contract.createBatch.estimateGas(
    productName, batchSize, location
  );
  
  // Add 20% buffer
  const gasLimit = gasEstimate.mul(120).div(100);
  
  const tx = await this.contract.createBatch(
    productName, 
    batchSize, 
    location,
    { gasLimit }
  );
  
  const receipt = await tx.wait();
  // ... rest of code
}
```

## Common Issues & Solutions

### Issue: "Contract not initialized"
**Solution:** Ensure wallet is connected before making contract calls

### Issue: Transaction fails
**Solution:** Check:
- Correct network selected in MetaMask
- Sufficient gas/ETH in wallet
- Contract address is correct
- Function parameters match contract

### Issue: Can't read events
**Solution:** Ensure event names match exactly, use try-catch for parsing

## Backend API Integration

Your backend should provide:

```javascript
// GET /batch/:id/history
{
  batchId: string,
  events: [
    {
      action: string,
      handler: address,
      location: string,
      timestamp: number,
      temperature?: number,
      humidity?: number
    }
  ]
}

// GET /batch/:id/integrity
{
  batchId: string,
  score: number,
  status: "SAFE" | "WARNING" | "TAMPERED",
  alerts: [
    {
      type: string,
      severity: "LOW" | "MEDIUM" | "HIGH",
      message: string,
      timestamp: number
    }
  ],
  checks: {
    temperatureInRange: boolean,
    humidityInRange: boolean,
    timelineConsistent: boolean,
    locationValid: boolean,
    noUnauthorizedAccess: boolean
  }
}
```

Update `src/services/mockAPI.js` with real axios calls.

## Next Steps

1. Write tests for contract interactions
2. Add error recovery mechanisms
3. Implement transaction status tracking
4. Add loading states for pending transactions
5. Handle network switching gracefully
