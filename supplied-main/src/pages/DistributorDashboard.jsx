import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, QrCode, Home, Package, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { mockContract } from '../services/mockContract';
import { useApp } from '../context/AppContext';
import { isValidAddress } from '../utils/helpers';
import QRScanner from '../components/QRScanner';
import Timeline from '../components/Timeline';
import LoadingSpinner from '../components/LoadingSpinner';
import RainbowShield from '../components/RainbowShield';
import FloatingLines from '../components/FloatingLines';

const DistributorDashboard = () => {
  const navigate = useNavigate();
  const { isInitialized } = useApp();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const loadBatch = async (batchId) => {
    setLoading(true);
    try {
      const batch = await mockContract.getBatch(batchId);

      // Also load blockchain history to show in timeline
      const { mockAPI } = await import('../services/mockAPI');
      const historyData = await mockAPI.getBatchHistory(batchId);

      setBatchData({
        ...batch,
        history: historyData?.events?.length ? historyData.events : (batch.history || []),
      });
      toast.success('Batch loaded successfully!');
    } catch (error) {
      console.error('Failed to load batch:', error);
      toast.error('Batch not found. Please check the ID.');
      setBatchData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (scannedId) => {
    setShowScanner(false);
    loadBatch(scannedId);
  };

  const onSubmit = async (data) => {
    if (!isInitialized) {
      toast.error('Contract not initialized. Please reconnect wallet.');
      return;
    }

    if (!isValidAddress(data.nextHandler)) {
      toast.error('Invalid Ethereum address');
      return;
    }

    setLoading(true);
    try {
      await mockContract.transferBatch(
        batchData.batchId,
        data.nextHandler,
        data.location
      );

      setTransferSuccess(true);
      toast.success('Batch transferred successfully!');
      reset();
      setTimeout(() => {
        setBatchData(null);
        setTransferSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to transfer batch:', error);
      toast.error('Failed to transfer batch. Please try again.');
    } finally {
      setLoading(false);
    }
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

        <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {!batchData ? (
          /* Scan Batch */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            <Truck size={64} className="text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Transfer Batch Custody
            </h2>
            <p className="text-slate-400 mb-8">
              Scan the product QR code to load batch details
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScanner(true)}
              className="btn-primary mb-6 mx-auto "
            >
              <QrCode size={80} className="mr-4 my-2 mx-auto" />
              Scan QR Code
            </motion.button>

            <div className="text-slate-500 text-sm">
              <p>You can also load a demo batch for testing:</p>
              <button
                onClick={() => loadBatch('BATCH-2026-001-DEMO')}
                className="text-cyber-400 hover:text-cyber-300 underline mt-2"
              >
                Load Demo Batch
              </button>
            </div>
          </motion.div>
        ) : transferSuccess ? (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={32} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Transfer Completed!
            </h2>
            <p className="text-slate-400">
              Batch custody has been transferred successfully
            </p>
          </motion.div>
        ) : (
          /* Transfer Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Batch Info */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Batch Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Batch ID</p>
                  <p className="text-white font-mono text-sm">{batchData.batchId}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Product</p>
                  <p className="text-white font-semibold">{batchData.productName}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Batch Size</p>
                  <p className="text-white">{batchData.batchSize ? `${batchData.batchSize} units` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Current Status</p>
                  <p className="text-white">{batchData.status || batchData.location || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* History */}
            {batchData.history && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Transfer History</h3>
                <Timeline events={batchData.history} />
              </div>
            )}

            {/* Transfer Form */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Transfer Custody</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Next Handler Address *
                  </label>
                  <input
                    {...register('nextHandler', {
                      required: 'Handler address is required',
                      validate: (value) => isValidAddress(value) || 'Invalid Ethereum address',
                    })}
                    type="text"
                    placeholder="0x..."
                    className="input-field w-full font-mono text-sm"
                  />
                  {errors.nextHandler && (
                    <p className="text-red-400 text-sm mt-1">{errors.nextHandler.message}</p>
                  )}
                  <p className="text-slate-500 text-xs mt-1">
                    Enter the Ethereum address of the next handler (retailer or another distributor)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Transfer Location *
                  </label>
                  <input
                    {...register('location', { required: 'Location is required' })}
                    type="text"
                    placeholder="e.g., Miami, FL"
                    className="input-field w-full"
                  />
                  {errors.location && (
                    <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !isInitialized}
                  className="btn-primary w-full text-lg py-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="spinner w-5 h-5" />
                      <span>Transferring...</span>
                    </div>
                  ) : (
                    <>
                      <Truck size={50} className="mx-auto flex gap-2 items-center" />
                      Transfer Batch
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Cancel */}
            <div className="text-center">
              <button
                onClick={() => setBatchData(null)}
                className="btn-secondary"
              >
                Cancel & Scan Another
              </button>
            </div>
          </motion.div>
        )}
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
        )}

        {/* Loading Overlay */}
        {loading && batchData === null && <LoadingSpinner fullScreen message="Loading batch..." />}
      </div>
    </div>
  );
};

export default DistributorDashboard;
