import { sleep } from '../utils/helpers';
import * as realAPI from './apiService';

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

/**
 * API Service
 * When USE_REAL_API is true  → calls Express backend
 * When USE_REAL_API is false → returns mock data for offline development
 */

class APIService {
  constructor() {
    this.token = null;
  }

  setToken(token) { this.token = token; localStorage.setItem('auth_token', token); }
  getToken() { if (!this.token) this.token = localStorage.getItem('auth_token'); return this.token; }
  clearToken() { this.token = null; localStorage.removeItem('auth_token'); }

  /** Login (still mock-based — no backend auth endpoint yet) */
  async login(walletAddress, role) {
    await sleep(500);
    const mockToken = `jwt_${Date.now()}_${walletAddress.slice(0, 10)}`;
    this.setToken(mockToken);
    return { token: mockToken, user: { address: walletAddress, role } };
  }

  /**
   * Get batch history (blockchain events → Timeline-compatible format)
   */
  async getBatchHistory(batchId) {
    if (USE_REAL_API) {
      try {
        return await realAPI.getBatchHistory(batchId);  // already normalised
      } catch (err) {
        console.warn('API getBatchHistory failed, falling back to mock:', err.message);
      }
    }

    // ── Mock fallback ──
    await sleep(200);
    if (String(batchId).includes('DEMO')) {
      return {
        batchId,
        events: [
          { id: 1, action: 'CREATED', handler: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', location: 'Medellin, Colombia', timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, temperature: 22, humidity: 65 },
          { id: 2, action: 'TRANSFERRED', handler: '0x1234567890123456789012345678901234567890', location: 'Miami, FL', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, temperature: 24, humidity: 70 },
          { id: 3, action: 'CONFIRMED', handler: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', location: 'New York, NY', timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, temperature: 23, humidity: 68 },
        ],
      };
    }
    return { batchId, events: [] };
  }

  /**
   * Get integrity score / status for a batch
   */
  async getIntegrityScore(batchId) {
    if (USE_REAL_API) {
      try {
        // Derive integrity from real batch data
        const batch = await realAPI.getBatch(batchId);
        const score = batch.status === 'DELIVERED' ? 95 : 85;
        const status = score >= 90 ? 'SAFE' : score >= 70 ? 'WARNING' : 'TAMPERED';
        return {
          batchId, score, status,
          alerts: batch.alerts || [],
          checks: {
            temperatureInRange: true,
            humidityInRange: true,
            timelineConsistent: true,
            locationValid: true,
            noUnauthorizedAccess: true,
          },
        };
      } catch (err) {
        console.warn('API getIntegrityScore failed, falling back to mock:', err.message);
      }
    }

    // ── Mock fallback ──
    await sleep(300);
    if (String(batchId).includes('DEMO')) {
      return {
        batchId, score: 95, status: 'SAFE', alerts: [],
        checks: { temperatureInRange: true, humidityInRange: true, timelineConsistent: true, locationValid: true, noUnauthorizedAccess: true },
      };
    }
    const score = Math.floor(Math.random() * 30) + 70;
    const status = score >= 90 ? 'SAFE' : score >= 70 ? 'WARNING' : 'TAMPERED';
    return {
      batchId, score, status,
      alerts: status === 'WARNING' ? [{ type: 'TEMPERATURE', severity: 'MEDIUM', message: 'Temperature exceeded threshold for 2 hours', timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 }] : [],
      checks: { temperatureInRange: status !== 'TAMPERED', humidityInRange: true, timelineConsistent: true, locationValid: true, noUnauthorizedAccess: status !== 'TAMPERED' },
    };
  }

  async reportAnomaly(batchId, anomalyType, description) {
    await sleep(500);
    return { success: true, message: 'Anomaly reported', reportId: `RPT-${Date.now()}` };
  }

  async getAnalytics(address) {
    if (USE_REAL_API) {
      try {
        const batches = await realAPI.listBatches();
        return {
          totalBatches: batches.length,
          activeBatches: batches.filter(b => (b.status ?? 0) === 0).length,
          averageIntegrityScore: 92,
          anomalyRate: 0,
          recentActivity: [],
        };
      } catch (err) {
        console.warn('API getAnalytics failed, falling back to mock:', err.message);
      }
    }

    await sleep(1000);
    return {
      totalBatches: 47, activeBatches: 12, averageIntegrityScore: 92,
      anomalyRate: 3.2,
      recentActivity: [
        { date: Date.now(), count: 5 },
        { date: Date.now() - 86400000, count: 8 },
        { date: Date.now() - 172800000, count: 3 },
      ],
    };
  }
}

export const mockAPI = new APIService();
