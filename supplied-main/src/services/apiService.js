import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * Centralized API client for backend communication.
 * All methods call the Express backend which talks to the blockchain.
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Status helpers ──────────────────────────────────────────────
// Smart-contract status enum: 0 = Manufactured, 1 = ReadyForSale
const STATUS_MAP = { 0: 'CREATED', 1: 'DELIVERED' };

function mapStatus(raw) {
  if (typeof raw === 'string') return raw;
  return STATUS_MAP[raw] ?? 'CREATED';
}

// ── Data normalisers ────────────────────────────────────────────
/**
 * Normalise the backend GET /batches/:id response into the shape
 * every frontend page already expects.
 */
export function normaliseBatch(data) {
  const oc = data.onChain || {};
  const db = data.db || {};
  return {
    batchId: oc.batchId ?? db.batchId,
    productName: oc.productName || db.productName || 'Unknown Product',
    manufacturer: oc.manufacturer || db.manufacturer || '',
    supplier: oc.supplier || '',
    status: mapStatus(oc.status ?? db.status),
    createdAt: oc.timestamp || db.createdAt || Date.now(),
    location: db.location || '',
    batchSize: db.batchSize || null,
    currentHandler: oc.supplier || oc.manufacturer || '',
    transfers: data.transfers || [],
    alerts: data.alerts || [],
    // build a synthetic history array from transfers
    history: (data.transfers || []).map((t, i) => ({
      id: i,
      handler: t.to || t.from,
      location: t.location || '',
      timestamp: t.timestamp,
      action: 'TRANSFERRED',
    })),
  };
}

/**
 * Normalise GET /batches/:id/history blockchain events into Timeline-
 * compatible objects ({ action, handler, timestamp, location, txHash }).
 */
export function normaliseHistory(data) {
  const events = (data.events || []).map((ev, i) => {
    if (ev.type === 'BatchCreated') {
      return {
        id: i,
        action: 'CREATED',
        handler: ev.manufacturer,
        location: 'On-chain',
        timestamp: ev.timestamp,
        txHash: ev.transactionHash,
      };
    }

    // StatusUpdated  →  newStatus 1 means "Ready for Sale" / CONFIRMED
    return {
      id: i,
      action: ev.newStatus === 1 ? 'CONFIRMED' : 'TRANSFERRED',
      handler: ev.updatedBy,
      location: 'On-chain',
      timestamp: ev.timestamp,
      txHash: ev.transactionHash,
    };
  });

  return { batchId: data.batchId, events };
}

// ── API methods ─────────────────────────────────────────────────

/** List all batches (manufacturer overview). */
export async function listBatches() {
  const res = await api.get('/batches');
  return res.data; // array of batch objects
}

/** Get a single batch (on-chain + DB merged). Returns normalised shape. */
export async function getBatch(batchId) {
  const res = await api.get(`/batches/${encodeURIComponent(batchId)}`);
  return normaliseBatch(res.data);
}

/** Create a new batch. Returns { success, batchId, productName }. */
export async function createBatch(productName) {
  const res = await api.post('/batches', { productName });
  return res.data;
}

/** Mark a batch ready-for-sale (supplier action). */
export async function markReady(batchId) {
  const res = await api.post(`/batches/${encodeURIComponent(batchId)}/ready`);
  return res.data;
}

/** Get blockchain event history for a batch. Returns normalised events. */
export async function getBatchHistory(batchId) {
  const res = await api.get(`/batches/${encodeURIComponent(batchId)}/history`);
  return normaliseHistory(res.data);
}

/** Record an off-chain transfer. */
export async function addTransfer(batchId, from, to) {
  const res = await api.post(`/batches/${encodeURIComponent(batchId)}/transfers`, { from, to });
  return res.data;
}

/** Get next batch ID from the contract. */
export async function getCurrentId() {
  const res = await api.get('/batches/current-id');
  return res.data.nextBatchId;
}

export default api;
