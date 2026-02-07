import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, ArrowLeft, QrCode, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { mockContract } from '../services/mockContract';
import { useApp } from '../context/AppContext';
import QRScanner from '../components/QRScanner';
import Timeline from '../components/Timeline';
import LoadingSpinner from '../components/LoadingSpinner';

const RetailerDashboard = () => {
  const navigate = useNavigate();
  const { isInitialized } = useApp();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const loadBatch = async (batchId) => {
    setLoading(true);
    try {
      const batch = await mockContract.getBatch(batchId);
      setBatchData(batch);
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

    setLoading(true);
    try {
      await mockContract.confirmReceipt(batchData.batchId, data.location);

      setConfirmSuccess(true);
      toast.success('Receipt confirmed successfully!');
      reset();
      setTimeout(() => {
        setBatchData(null);
        setConfirmSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to confirm receipt:', error);
      toast.error('Failed to confirm receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-40 bg-dark-200/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/role-selection')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <Store className="text-green-400" size={24} />
            <h1 className="text-xl font-bold font-display text-white">
              RETAILER
            </h1>
          </div>

          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!batchData ? (
          /* Scan Batch */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            <Store size={64} className="text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Confirm Batch Receipt
            </h2>
            <p className="text-slate-400 mb-8">
              Scan the product QR code to confirm receipt and prepare for sale
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScanner(true)}
              className="btn-primary mb-6"
            >
              <QrCode size={20} className="mr-2" />
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
        ) : confirmSuccess ? (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Receipt Confirmed!
            </h2>
            <p className="text-slate-400 mb-4">
              Batch is now ready for consumer sale
            </p>
            <div className="inline-block px-6 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-mono">
              READY FOR SALE
            </div>
          </motion.div>
        ) : (
          /* Confirm Form */
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
                  <p className="text-white">{batchData.batchSize} units</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                    {batchData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* History */}
            {batchData.history && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Supply Chain Journey</h3>
                <Timeline events={batchData.history} />
              </div>
            )}

            {/* Confirmation Form */}
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Confirm Receipt</h3>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  ℹ️ By confirming receipt, you acknowledge that the batch has arrived at your
                  retail location and is ready to be sold to consumers.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Retail Location *
                  </label>
                  <input
                    {...register('location', { required: 'Location is required' })}
                    type="text"
                    placeholder="e.g., New York, NY - Store #123"
                    className="input-field w-full"
                  />
                  {errors.location && (
                    <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
                  )}
                  <p className="text-slate-500 text-xs mt-1">
                    Enter your retail store location for tracking purposes
                  </p>
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
                      <span>Confirming...</span>
                    </div>
                  ) : (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      Confirm Receipt
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
  );
};

export default RetailerDashboard;
