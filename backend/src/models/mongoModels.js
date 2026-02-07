import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  productName: { type: String },
  manufacturer: { type: String },
  supplier: { type: String },
  status: { type: String },
  timestamp: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const transferSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const alertSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Batch = mongoose.model("Batch", batchSchema);
export const Transfer = mongoose.model("Transfer", transferSchema);
export const Alert = mongoose.model("Alert", alertSchema);
