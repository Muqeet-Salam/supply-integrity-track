import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, ArrowLeft, Download, Share2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QRScanner from '../components/QRScanner';
import Timeline from '../components/Timeline';
import IntegrityBadge from '../components/IntegrityBadge';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockContract } from '../services/mockContract';
import { mockAPI } from '../services/mockAPI';
import { DEMO_BATCH_ID } from '../utils/constants';

const ConsumerVerification = () => {
  const { batchId: urlBatchId } = useParams();
  const navigate = useNavigate();

  const [showScanner, setShowScanner] = useState(false);
  const [batchId, setBatchId] = useState(urlBatchId || '');
  const [batchData, setBatchData] = useState(null);
  const [history, setHistory] = useState(null);
  const [integrityData, setIntegrityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState('');

  // Auto-verify if batch ID in URL
  useEffect(() => {
    if (urlBatchId) {
      verifyBatch(urlBatchId);
    }
  }, [urlBatchId]);

  const verifyBatch = async (id) => {
    if (!id) {
      toast.error('Please enter a batch ID');
      return;
    }

    setLoading(true);
    setBatchId(id);

    try {
      // Fetch batch data from contract
      const batch = await mockContract.getBatch(id);
      setBatchData(batch);

      // Fetch history from API
      const historyData = await mockAPI.getBatchHistory(id);
      setHistory(historyData);

      // Fetch integrity score
      const integrity = await mockAPI.getIntegrityScore(id);
      setIntegrityData(integrity);

      toast.success('Batch verified successfully!');
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Failed to verify batch. Please check the ID and try again.');
      setBatchData(null);
      setHistory(null);
      setIntegrityData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (scannedId) => {
    setShowScanner(false);
    verifyBatch(scannedId);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      verifyBatch(manualInput.trim());
    }
  };

  const handleLoadDemo = () => {
    verifyBatch(DEMO_BATCH_ID);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/verify/${batchId}`;
    try {
      await navigator.share({
        title: 'Product Verification',
        text: `Check out this verified product: ${batchData?.productName}`,
        url: url,
      });
    } catch (err) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-40 bg-dark-200/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h1 className="text-xl font-bold font-display text-white">
            VERIFY PRODUCT
          </h1>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Scan Section */}
        {!batchData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center mb-8"
          >
            <QrCode size={64} className="text-cyber-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Scan Product QR Code
            </h2>
            <p className="text-slate-400 mb-8">
              Verify the authenticity and track the journey of your product
            </p>

            {/* Scan Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScanner(true)}
              className="btn-primary mb-4 w-full max-w-md mx-auto text-lg"
            >
              <QrCode size={20} className="mr-2" />
              Scan QR Code
            </motion.button>

            {/* Manual Input */}
            <div className="my-8">
              <p className="text-slate-500 mb-4">Or enter batch ID manually</p>
              <form onSubmit={handleManualSubmit} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="BATCH-2026-001-XXXXX"
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary">
                  Verify
                </button>
              </form>
            </div>

            {/* Demo Button */}
            <button
              onClick={handleLoadDemo}
              className="text-cyber-400 hover:text-cyber-300 text-sm underline"
            >
              Load Demo Batch
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-20">
            <LoadingSpinner message="Verifying batch..." />
          </div>
        )}

        {/* Verification Results */}
        {!loading && batchData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Product Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {batchData.productName}
                  </h2>
                  <p className="text-slate-400 font-mono text-sm">
                    Batch ID: {batchData.batchId}
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Status</p>
                  <p className="text-white font-semibold">{batchData.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Manufacturer</p>
                  <p className="text-white font-semibold truncate">{batchData.manufacturer || batchData.location || 'N/A'}</p>
                </div>
              </div>
            </motion.div>

            {/* Integrity Badge */}
            {integrityData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <IntegrityBadge
                  status={integrityData.status}
                  score={integrityData.score}
                />
              </motion.div>
            )}

            {/* Alerts */}
            {integrityData?.alerts && integrityData.alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AlertBanner alerts={integrityData.alerts} />
              </motion.div>
            )}

            {/* Integrity Checks */}
            {integrityData?.checks && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Security Checks
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(integrityData.checks).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        value ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          value ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-sm text-slate-300">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            {history?.events && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  Product Journey
                </h3>
                <Timeline events={history.events} />
              </motion.div>
            )}

            {/* Verify Another */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center pt-8"
            >
              <button
                onClick={() => {
                  setBatchData(null);
                  setHistory(null);
                  setIntegrityData(null);
                  setBatchId('');
                  setManualInput('');
                }}
                className="btn-secondary"
              >
                Verify Another Product
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default ConsumerVerification;
