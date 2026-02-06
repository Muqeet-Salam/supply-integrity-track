export function timestampRegression(history, current) {
  if (history.length < 2) return null;
  const prev = history[history.length - 2];
  if (current.timestamp < prev.timestamp) {
    return "Timestamp regression detected";
  }
  return null;
}

export function duplicateTransfer(history, current) {
  return history.filter((h) => h.from === current.from && h.to === current.to)
    .length > 1
    ? "Duplicate transfer detected"
    : null;
}
