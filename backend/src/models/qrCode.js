import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  qrData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const QRCode = mongoose.model("QRCode", qrCodeSchema);
