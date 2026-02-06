import { saveAlert } from "../models/store.js";

export function runAnomalyChecks(batchId, transfer) {
  if (transfer.from === transfer.to) {
    saveAlert(batchId, "Sender and receiver are identical");
  }
}
