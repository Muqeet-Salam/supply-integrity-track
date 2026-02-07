import { sleep } from '../utils/helpers';
import * as realAPI from './apiService';

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

/**
 * Contract Service
 * When USE_REAL_API is true  → calls the Express backend (which talks to the blockchain)
 * When USE_REAL_API is false → returns mock/demo data for offline development
 */

class ContractService {
  constructor() {
    this.batches = new Map();
    this.initialized = false;
  }

  /** Initialize (only needed for mock wallet-based signing) */
  async initialize(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.initialized = true;
    console.log('✅ Contract Service Initialized (USE_REAL_API=' + USE_REAL_API + ')');
    return true;
  }

  /** Create a new batch */
  async createBatch(productName, batchSize, location) {
    if (USE_REAL_API) {
      try {
        const data = await realAPI.createBatch(productName);
        return data; // { success, batchId, productName }
      } catch (err) {
        console.warn('API createBatch failed, falling back to mock:', err.message);
      }
    }

    // ── Mock fallback ──
    await sleep(2000);
    const batchId = `BATCH-${Date.now()}`;
    const addr = this.signer ? await this.signer.getAddress() : '0x0000000000000000000000000000000000000000';
    const batch = {
      batchId, productName, batchSize, location,
      manufacturer: addr, currentHandler: addr,
      status: 'CREATED', createdAt: Date.now(),
      history: [{ handler: addr, location, timestamp: Date.now(), action: 'CREATED' }],
    };
    this.batches.set(batchId, batch);
    return { batchId, txHash: `0x${Math.random().toString(16).slice(2)}` };
  }

  /** Transfer batch custody */
  async transferBatch(batchId, nextHandler, location) {
    if (USE_REAL_API) {
      try {
        const from = this.signer ? await this.signer.getAddress() : undefined;
        return await realAPI.addTransfer(batchId, from, nextHandler);
      } catch (err) {
        console.warn('API transferBatch failed, falling back to mock:', err.message);
      }
    }

    const batch = this.batches.get(String(batchId));
    if (!batch) throw new Error('Batch not found');
    await sleep(2000);
    batch.currentHandler = nextHandler;
    batch.status = 'IN_TRANSIT';
    batch.history.push({ handler: nextHandler, location, timestamp: Date.now(), action: 'TRANSFERRED' });
    this.batches.set(String(batchId), batch);
    return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` };
  }

  /** Mark batch ready-for-sale (supplier / confirm receipt) */
  async confirmReceipt(batchId, location) {
    if (USE_REAL_API) {
      try {
        return await realAPI.markReady(batchId);
      } catch (err) {
        console.warn('API confirmReceipt failed, falling back to mock:', err.message);
      }
    }

    const batch = this.batches.get(String(batchId));
    if (!batch) throw new Error('Batch not found');
    await sleep(2000);
    batch.status = 'DELIVERED';
    const addr = this.signer ? await this.signer.getAddress() : '0x0000000000000000000000000000000000000000';
    batch.history.push({ handler: addr, location, timestamp: Date.now(), action: 'CONFIRMED' });
    this.batches.set(String(batchId), batch);
    return { success: true, txHash: `0x${Math.random().toString(16).slice(2)}` };
  }

  /** Get single batch details */
  async getBatch(batchId) {
    if (USE_REAL_API) {
      try {
        return await realAPI.getBatch(batchId);   // returns normalised shape
      } catch (err) {
        console.warn('API getBatch failed, falling back to mock:', err.message);
      }
    }

    await sleep(200);
    const batch = this.batches.get(String(batchId));
    if (batch) return batch;
    if (String(batchId).includes('DEMO')) return this.getDemoBatch();
    throw new Error('Batch not found');
  }

  /** List batches for an address (manufacturer overview) */
  async getBatchesByAddress(address) {
    if (USE_REAL_API) {
      try {
        return await realAPI.listBatches();
      } catch (err) {
        console.warn('API listBatches failed, falling back to mock:', err.message);
      }
    }

    await sleep(200);
    return Array.from(this.batches.values()).filter(
      (b) => b.manufacturer === address || b.currentHandler === address,
    );
  }

  /** Demo batch for offline testing */
  getDemoBatch() {
    return {
      batchId: 'BATCH-2026-001-DEMO',
      productName: 'Premium Coffee Beans',
      batchSize: 500,
      location: 'Colombia',
      manufacturer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      currentHandler: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      status: 'DELIVERED',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      history: [
        { handler: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', location: 'Medellin, Colombia', timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, action: 'CREATED' },
        { handler: '0x1234567890123456789012345678901234567890', location: 'Miami, FL', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, action: 'TRANSFERRED' },
        { handler: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', location: 'New York, NY', timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, action: 'CONFIRMED' },
      ],
    };
  }

  /** Stub event listeners */
  onBatchCreated(callback) { console.log('Listening for BatchCreated events'); }
  onBatchTransferred(callback) { console.log('Listening for BatchTransferred events'); }
}

export const mockContract = new ContractService();
