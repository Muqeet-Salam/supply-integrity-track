import { db } from "../config/firebase.js";

export async function addBatch(batchId, data = {}) {
  const id = String(batchId);
  const ref = db.collection("batches").doc(id);
  await ref.set(
    {
      batchId: id,
      createdAt: Date.now(),
      status: "Manufactured",
      ...data,
    },
    { merge: true }
  );
}

export async function updateBatchStatus(batchId, status) {
  const id = String(batchId);
  const ref = db.collection("batches").doc(id);
  await ref.set({ status, updatedAt: Date.now() }, { merge: true });
}

export async function addTransfer(transfer) {
  const ref = db.collection("transfers").doc();
  await ref.set({
    ...transfer,
    batchId: String(transfer.batchId),
    timestamp: transfer.timestamp || Date.now(),
  });
}

export async function saveAlert(batchId, reason) {
  const ref = db.collection("alerts").doc();
  await ref.set({
    batchId: String(batchId),
    reason,
    timestamp: Date.now(),
  });
}

export async function getBatch(batchId) {
  const id = String(batchId);
  const doc = await db.collection("batches").doc(id).get();
  if (!doc.exists) return null;
  return doc.data();
}

export async function getTransfers(batchId) {
  const snapshot = await db
    .collection("transfers")
    .where("batchId", "==", String(batchId))
    .get();
  return snapshot.docs.map((d) => d.data());
}

export async function getAlerts(batchId) {
  const snapshot = await db
    .collection("alerts")
    .where("batchId", "==", String(batchId))
    .get();
  return snapshot.docs.map((d) => d.data());
}

export async function getAllBatches() {
  const snapshot = await db
    .collection("batches")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((d) => d.data());
}
