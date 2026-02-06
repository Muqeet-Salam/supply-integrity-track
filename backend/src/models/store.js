import { Batch, Transfer, Alert } from "./mongoModels.js";

export async function addBatch(batchId) {
  const exists = await Batch.findOne({ batchId });
  if (!exists) {
    await Batch.create({ batchId });
  }
}

export async function addTransfer(t) {
  await Transfer.create(t);
}

export async function saveAlert(batchId, reason) {
  await Alert.create({ batchId, reason });
}

export async function getBatch(batchId) {
  return await Batch.findOne({ batchId });
}

export async function getTransfers(batchId) {
  return await Transfer.find({ batchId });
}

export async function getAlerts(batchId) {
  return await Alert.find({ batchId });
}
