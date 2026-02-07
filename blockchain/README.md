# Blockchain Scripts

This folder contains scripts for interacting with the SupplyChain smart contract and automating batch creation, updates, and QR code generation.

## Key Scripts

- `createBatchWrapper.js`: Creates a new batch and uploads QR code directly to backend.
- `markReadyWrapper.js`: Marks a batch as ready for sale and uploads updated QR code to backend.
- `createBatch.js`, `markReadyForSale.js`: Core logic for interacting with the contract.

## Automation

- QR codes are generated in memory and POSTed to backend for real-time database sync.
- No files are written to `qr-codes` unless needed for backup.

## Requirements

- Node.js
- Hardhat
- Backend running at `http://localhost:5000`

## Usage

- Run scripts via npm commands or directly with Node.js.
- Ensure backend and MongoDB are running for full integration.

## .gitignore

- Ignore local build artifacts, node_modules, and sensitive files.

```
node_modules/
build/
.env
qr-codes/
```
