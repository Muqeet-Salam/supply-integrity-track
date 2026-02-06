import { transfers, saveAlert } from "../models/store.js";
import { timestampRegression, duplicateTransfer } from "./rules.js";

export function runAnomalyChecks(batchId, latestTransfer) {
  const history = transfers.get(batchId);

  const t1 = timestampRegression(history, latestTransfer);
  if (t1) saveAlert(batchId, t1);

  const t2 = duplicateTransfer(history, latestTransfer);
  if (t2) saveAlert(batchId, t2);
}
