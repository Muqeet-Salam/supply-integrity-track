# Backend QR Code Integration

## Importing QR Codes from Blockchain

To import all QR code JSON files from the blockchain/qr-codes folder into MongoDB:

1. Ensure your MongoDB connection string is set in `.env` as `MONGO_URI`.
2. Run the import script:

```bash
cd backend/scripts
node importQRCodes.js
```

This will upsert all QR code JSON files into the `QRCode` collection.

## Uploading QR Codes via API

You can upload a QR code JSON and image directly to the backend:

- `POST /api/batches/qr-codes/upload` (multipart/form-data)
  - Field `json`: The QR code JSON file (required)
  - Field `image`: The QR code PNG image (optional)

Example using curl:

```bash
curl -X POST http://localhost:5000/api/batches/qr-codes/upload \
	-F "json=@/path/to/batch_0_live_qr_data.json" \
	-F "image=@/path/to/batch_0_live_qr.png"
```

## Fetching QR Codes via API

- `GET /api/batches/qr-codes` — Returns all QR codes stored in MongoDB (without image by default)
- `GET /api/batches/qr-codes?withImage=1` — Returns all QR codes with images as base64

## Dependencies

- Uses `fs-extra` for robust file operations.
- QR code data is stored in the `QRCode` model with fields: `batchId`, `qrData`, `createdAt`.

## Notes

- The import script is idempotent (safe to run multiple times).
- Make sure the backend server is running and MongoDB is accessible.
