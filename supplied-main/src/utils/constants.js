// Application constants

export const ROLES = {
  MANUFACTURER: 'MANUFACTURER',
  DISTRIBUTOR: 'DISTRIBUTOR',
  RETAILER: 'RETAILER',
  CONSUMER: 'CONSUMER',
};

export const ROLE_LABELS = {
  [ROLES.MANUFACTURER]: 'Manufacturer',
  [ROLES.DISTRIBUTOR]: 'Distributor',
  [ROLES.RETAILER]: 'Retailer',
  [ROLES.CONSUMER]: 'Consumer',
};

export const BATCH_STATUS = {
  CREATED: 'CREATED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  VERIFIED: 'VERIFIED',
};

export const INTEGRITY_STATUS = {
  SAFE: 'SAFE',
  WARNING: 'WARNING',
  TAMPERED: 'TAMPERED',
};

export const CHAIN_CONFIG = {
  chainId: import.meta.env.VITE_CHAIN_ID || '11155111',
  chainName: import.meta.env.VITE_CHAIN_NAME || 'Sepolia',
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://yourapp.vercel.app';

// Mock data for demo
export const DEMO_BATCH_ID = 'BATCH-2026-001-DEMO';
export const DEMO_PRODUCT_NAME = 'Premium Coffee Beans';

// Animation delays for staggered reveals
export const ANIMATION_DELAYS = {
  card: 0.1,
  item: 0.05,
};

// QR Code settings
export const QR_CODE_SIZE = 256;
export const QR_CODE_LEVEL = 'H'; // High error correction
