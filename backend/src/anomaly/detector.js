import { saveAlert } from "../models/store.js";

export async function runAnomalyChecks(batchId, transfer) {
  if (transfer.from === transfer.to) {
    await saveAlert(batchId, "Sender and receiver are identical");
  }
}
