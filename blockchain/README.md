# Supply Chain Integrity Tracker - Blockchain

A Hardhat-based Ethereum project for tracking product batches through a supply chain using smart contracts.

# 1. Create batch with custom name + auto QR generation
npm run create-batch "Organic Colombian Coffee Beans - Premium Roast"

# 2. Scan QR to get batch info  
npm run scan-qr qr-codes/batch_1_live_qr_data.json
# → Shows: Batch ID: 1, Status: Manufactured

# 3. Mark ready using batch ID from QR
npm run mark-ready 1

# 4. Update QR with new status
npm run update-qr-live 1

# 5. Verify final status
npm run scan-qr qr-codes/batch_1_live_qr_data.json  
# → Shows: Status: Ready for Sale ✅

# 6. View complete history
npm run view-history 1

## Overview

This project implements a supply chain tracking system where:
- **Manufacturers** can create batches of products
- **Suppliers** can mark batches as ready for sale
- **Users** can view the complete history of any batch
- All interactions are recorded on the blockchain for transparency

## Architecture

- **Smart Contract**: `SupplyChain.sol` - Manages batch creation, status updates, and role permissions
- **Scripts**: CommonJS-based interaction scripts for deployment and testing
- **Accounts**: Uses multiple Hardhat accounts to simulate different roles

## Prerequisites

- Node.js (v16+)
- npm
- A local blockchain (Hardhat Network)

## Installation

1. Navigate to the blockchain directory:
   ```bash
   cd blockchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Quick Start

Follow these steps to deploy and test the complete supply chain:

### 1. Start Local Blockchain
```bash
npm run node
```
Keep this terminal open. This starts a local Hardhat network at `http://localhost:8545`.

### 2. Deploy Contract (in new terminal)
```bash
npm run deploy
```
This deploys the SupplyChain contract and saves deployment info to `deployment.json`.

### 3. Setup Roles
```bash
npm run setup-roles
```
This configures the manufacturer and supplier roles for testing accounts.

### 4. Create a Batch
```bash
npm run create-batch
```
Creates a new product batch using the manufacturer account.

### 5. Mark Ready for Sale
```bash
npm run mark-ready
```
Marks the batch as ready for sale using the supplier account.

### 6. View History
```bash
npm run view-history
```
Displays the complete history and timeline of the batch.

## Available Scripts

- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy contracts to localhost
- `npm run node` - Start local Hardhat network
- `npm run setup-roles` - Configure manufacturer and supplier roles
- `npm run create-batch` - Create a new product batch
- `npm run mark-ready` - Mark batch ready for sale
- `npm run view-history` - View batch history and timeline

## Manual Script Execution

You can also run scripts manually:

```bash
# Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Setup roles
npx hardhat run scripts/setupRoles.js --network localhost

# Create batch
npx hardhat run scripts/createBatch.js --network localhost

# Mark ready for sale
npx hardhat run scripts/markReadyForSale.js --network localhost

# View history
npx hardhat run scripts/viewHistory.js --network localhost

# View specific batch history
npx hardhat run scripts/viewHistory.js --network localhost -- BATCH_ID
```

## Account Setup

The project automatically uses Hardhat's default accounts:
- **Account[0]**: Contract owner/deployer (also has manufacturer role)
- **Account[1]**: Manufacturer
- **Account[2]**: Supplier  
- **Account[3]**: User (for querying history)

## Contract Functions

### Manufacturer Functions
- `createBatch(string productName)` - Create a new batch
- Returns batch ID for tracking

### Supplier Functions  
- `markReadyForSale(uint256 batchId)` - Mark batch ready for sale
- Must be registered supplier and batch must be in "Manufactured" status

### View Functions
- `getBatch(uint256 batchId)` - Get batch details
- `getCurrentBatchId()` - Get next available batch ID

### Owner Functions
- `addManufacturer(address)` - Register new manufacturer
- `addSupplier(address)` - Register new supplier

## Events

The contract emits these events for tracking:
- `BatchCreated` - When a new batch is created
- `StatusUpdated` - When batch status changes
- `ManufacturerAdded` - When new manufacturer is registered
- `SupplierAdded` - When new supplier is registered

## File Structure

```
blockchain/
├── contracts/
│   ├── SupplyChain.sol     # Main supply chain contract
│   └── Lock.sol            # Default Hardhat example (can be ignored)
├── scripts/
│   ├── deploy.js           # Contract deployment
│   ├── setupRoles.js       # Role configuration
│   ├── createBatch.js      # Batch creation
│   ├── markReadyForSale.js # Mark batch ready
│   └── viewHistory.js      # View batch history
├── hardhat.config.js       # Hardhat configuration
├── package.json           # Dependencies and scripts
└── deployment.json        # Auto-generated deployment info
```

## Troubleshooting

### Common Issues

1. **"deployment.json not found"**
   - Run `npm run deploy` first

2. **Role-based errors (NotManufacturer/NotSupplier)**
   - Run `npm run setup-roles` to configure accounts

3. **"No batches found"**  
   - Run `npm run create-batch` first

4. **"Invalid batch ID"**
   - Check available batch IDs with `npm run view-history`

### Network Issues

If you encounter connection issues:
1. Make sure local node is running (`npm run node`)
2. Check that localhost:8545 is accessible
3. Restart the local network if needed

### Windows-Specific

This project has been specifically configured for Windows compatibility:
- Uses CommonJS modules (no ESM imports)
- Proper path handling for Windows
- No UV_HANDLE_CLOSING errors

## Development

### Adding New Features

1. **New Contract Functions**: Add to `SupplyChain.sol`
2. **New Scripts**: Create in `scripts/` directory using CommonJS format
3. **New NPM Scripts**: Add to `package.json` scripts section

### Testing

The project includes:
- Role-based access control testing
- Batch lifecycle testing  
- Event emission verification
- Error handling validation

## QR Code Integration

While not implemented in the smart contract, QR codes can be generated off-chain using the batch ID. Each batch ID can be encoded in a QR code for easy scanning by end users.

Example QR code data format:
```
https://yourapp.com/batch/BATCH_ID
```

## License

MIT License - See individual files for specific license information.
