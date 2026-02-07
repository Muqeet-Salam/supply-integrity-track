export const mockBatches = [
  {
    id: 'BATCH-001',
    name: 'Organic Coffee Beans - Batch A',
    manufacturer: 'FreshBeans Coffee Co.',
    status: 'SAFE',
    date: '2026-02-05',
  },
  {
    id: 'BATCH-002',
    name: 'Dark Roast - Premium Selection',
    manufacturer: 'ArtisanBeams Ltd.',
    status: 'SAFE',
    date: '2026-02-04',
  },
  {
    id: 'BATCH-003',
    name: 'Single Origin Espresso',
    manufacturer: 'EliteRoast Inc.',
    status: 'WARNING',
    date: '2026-02-03',
  },
  {
    id: 'BATCH-004',
    name: 'Fair Trade Blend',
    manufacturer: 'EthicalTrade Co.',
    status: 'SAFE',
    date: '2026-02-02',
  },
  {
    id: 'BATCH-005',
    name: 'Limited Edition Single Origin',
    manufacturer: 'CraftRoasters LLC',
    status: 'SAFE',
    date: '2026-02-01',
  },
];

export const recentAlerts = [
  {
    id: 1,
    type: 'Temperature Alert',
    message: 'Batch BATCH-003 detected temperature deviation during transit.',
    severity: 'MEDIUM',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    type: 'Location Update',
    message: 'BATCH-001 arrived at destination warehouse.',
    severity: 'LOW',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    type: 'Integrity Warning',
    message: 'Unusual QR code scan pattern detected on BATCH-002.',
    severity: 'MEDIUM',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
];
