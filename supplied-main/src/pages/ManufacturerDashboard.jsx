import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Plus, CheckCircle, Home, Truck, Search } from 'lucide-react';
import QRDisplay from '../components/QRDisplay';
import RainbowShield from '../components/RainbowShield';
import FloatingLines from '../components/FloatingLines';
import { toast } from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { mockContract } from '../services/mockContract';

const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const { walletAddress, isInitialized, connectWallet } = useApp();
  const [productName, setProductName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [createdBatch, setCreatedBatch] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [recentBatches, setRecentBatches] = useState([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (walletAddress) {
          const list = await mockContract.getBatchesByAddress(walletAddress);
          if (mounted) setRecentBatches(Array.isArray(list) ? list : []);
        } else {
          // show demo batch when no wallet connected
          setRecentBatches([mockContract.getDemoBatch()]);
        }
      } catch (err) {
        console.error('Failed to load recent batches:', err);
        if (mounted) setRecentBatches([]);
      }
    };

    load();
    return () => { mounted = false; };
  }, [walletAddress]);

  const handleCreate = () => {
    if (!productName) {
      toast.error('Please enter a product name');
      return;
    }

    // Ensure wallet connected
    const doCreate = async () => {
      try {
        if (!isInitialized) {
          await connectWallet();
        }

        setIsCreating(true);

        // Call mockContract which will forward to backend if configured
        const res = await mockContract.createBatch(productName);

        // Backend may return { success, batchId, productName } or the mock returns { batchId, txHash }
        const batchId = res.batchId || (res.batch && res.batch.batchId) || (res.id ? res.id : undefined);
        setCreatedBatch({ batchId, productName, manufacturer: walletAddress || manufacturer });
        toast.success('Batch created successfully!');
      } catch (err) {
        console.error('Create batch failed:', err);
        toast.error(err.message || 'Failed to create batch');
      } finally {
        setIsCreating(false);
      }
    };

    doCreate();
  };

  const reset = () => {
    setCreatedBatch(null);
    setProductName('');
    setManufacturer('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <FloatingLines 
            enabledWaves={["top","middle","bottom"]}
            linesGradient={["#ff5f6d","#ffc371","#ffd166","#38b6ff","#7c4dff","#ff66c4"]}
            lineCount={5}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
          />
        </div>
        {/* Overlay Blur */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/20 z-0"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="container mx-auto px-10 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <RainbowShield size={32} />
              <div>
                <h1 className="text-xl font-bold font-display text-white">
                  SUPPLY CHAIN
                </h1>
                <p className="text-xs font-mono">INTEGRITY TRACKER</p>
              </div>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {[
                { label: 'Home', path: '/', icon: Home },
                { label: 'Manufacturer', path: '/manufacturer', icon: Package },
                { label: 'Distributor', path: '/distributor', icon: Truck },
                { label: 'Verify Product', path: '/verify', icon: Search },
              ].map((link) => {
                const isActive = window.location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500/20 text-white border border-cyan-400/50'
                        : 'text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </motion.nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 pb-20">
        {!createdBatch ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Batch */}
              <div className="glass-card p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Create New Batch</h2>
                  <p className="text-slate-400">Register a new product batch</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
                    <input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Premium Coffee Beans"
                      className="input-field w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer</label>
                    <input
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="e.g. FreshBeans Co."
                      className="input-field w-full"
                    />
                  </div>

                  <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                  >
                    {isCreating ? (
                      <div className="spinner w-4 h-4" />
                    ) : (
                      <Plus size={16} />
                    )}
                    {isCreating ? 'Creating...' : 'Create Batch'}
                  </button>
                </div>
              </div>

              {/* Recent Batches */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Recent Batches</h2>
                <div className="space-y-3">
                  {recentBatches.length === 0 ? (
                    <p className="text-sm text-slate-500">No recent batches. Create one to get started.</p>
                  ) : (
                    recentBatches.map((b, i) => (
                      <motion.div
                        key={b.batchId || i}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all border border-slate-700/30 hover:border-cyber-500/30 group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-cyber-400 transition-colors">
                            {b.productName || b.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {b.batchId || b.id} · {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <QRDisplay value={b.batchId || b.id} size={40} />
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-3">What happens next?</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-400 mt-2" />
                  <span>Batch is registered on the blockchain with your wallet address</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-400 mt-2" />
                  <span>A unique QR code is generated for product verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-400 mt-2" />
                  <span>Download and attach the QR code to your product packaging</span>
                </li>
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card p-8 text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Batch Created!</h2>
              <p className="text-slate-400 mb-4">{createdBatch.productName}</p>

              <div className="flex justify-center mb-6">
                <QRDisplay value={`${window.location.origin}/verify?batch=${createdBatch.batchId}`} label={`Batch #${createdBatch.batchId}`} size={200} showDownload />
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={reset} className="btn-secondary">Create Another</button>
              </div>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
