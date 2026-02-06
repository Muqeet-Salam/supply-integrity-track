import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  qrData: { type: Object, required: true },
  image: { type: Buffer }, // Store image as binary
  imageType: { type: String }, // e.g., 'image/png'
  createdAt: { type: Date, default: Date.now },
});

export const QRCode = mongoose.model("QRCode", qrCodeSchema);
