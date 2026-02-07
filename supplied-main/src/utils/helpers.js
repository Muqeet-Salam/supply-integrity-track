import { format } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

/**
 * Format Ethereum address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Generate random batch ID
 */
export const generateBatchId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BATCH-${new Date().getFullYear()}-${random}-${timestamp.toString().slice(-6)}`;
};

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Get integrity color class
 */
export const getIntegrityColor = (status) => {
  switch (status) {
    case 'SAFE':
      return 'bg-status-safe text-white';
    case 'WARNING':
      return 'bg-status-warning text-white';
    case 'TAMPERED':
      return 'bg-status-danger text-white';
    default:
      return 'bg-slate-600 text-white';
  }
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'CREATED':
      return 'bg-blue-500 text-white';
    case 'IN_TRANSIT':
      return 'bg-yellow-500 text-white';
    case 'DELIVERED':
      return 'bg-green-500 text-white';
    case 'VERIFIED':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-slate-600 text-white';
  }
};

/**
 * Sleep utility for animations
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Generate deep link for QR code
 */
export const generateDeepLink = (batchId) => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://yourapp.vercel.app';
  return `${baseUrl}/verify/${batchId}`;
};

/**
 * Parse deep link to extract batch ID
 * Supports both formats:
 *   /verify?batch=0        → "0"
 *   /verify/BATCH-123      → "BATCH-123"
 *   /consumer-dashboard/5  → "5"
 */
export const parseBatchIdFromLink = (link) => {
  try {
    const url = new URL(link);

    // 1. Check for ?batch= query parameter first
    const batchParam = url.searchParams.get('batch');
    if (batchParam) return batchParam;

    // 2. Fall back to last path segment (e.g. /verify/BATCH-123)
    const pathParts = url.pathname.split('/').filter(Boolean);
    const last = pathParts[pathParts.length - 1];
    // Don't return route names like "verify" as a batch ID
    if (last && last !== 'verify' && last !== 'consumer-dashboard') {
      return last;
    }

    return link; // nothing found, return raw
  } catch {
    return link; // Return as-is if not a valid URL
  }
};

/**
 * Random characters for decode animation
 */
export const getRandomChar = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  return chars[Math.floor(Math.random() * chars.length)];
};

/**
 * Generate random matrix-style string
 */
export const generateMatrixString = (length) => {
  return Array(length).fill(0).map(() => getRandomChar()).join('');
};
