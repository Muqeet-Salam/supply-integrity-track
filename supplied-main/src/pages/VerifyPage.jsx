import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertTriangle, Home, Package, Truck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import IntegrityBadge from '../components/IntegrityBadge';
import Timeline from '../components/Timeline';
import QRScanner from '../components/QRScanner';
import LoadingSpinner from '../components/LoadingSpinner';
import RainbowShield from '../components/RainbowShield';
import FloatingLines from '../components/FloatingLines';
import { mockAPI } from '../services/mockAPI';
import { mockContract } from '../services/mockContract';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [batchId, setBatchId] = useState(searchParams.get('batch') || '');
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const navLinks = [
    { label: 'Consumer', path: '/', icon: ArrowRight },
    { label: 'Manufacturer', path: '/manufacturer-login', icon: Package },
    { label: 'Distributor', path: '/distributor-login', icon: Truck },
    { label: 'Verify Product', path: '/verify', icon: Search },
  ];

  useEffect(() => {
    const param = searchParams.get('batch');
    if (param) {
      setBatchId(param);
      lookupBatch(param);
    }
  }, [searchParams]);

  const lookupBatch = async (id) => {
    if (!id) {
      toast.error('Please enter a batch ID');
      return;
    }

    setSearching(true);
    try {
      // Fetch batch data from backend / contract service
      const contractData = await mockContract.getBatch(id);

      if (!contractData) {
        toast.error('Batch not found. Try another ID.');
        setResult(null);
        setSearching(false);
        return;
      }

      // Fetch history & integrity from backend
      const history = await mockAPI.getBatchHistory(id);
      const integrity = await mockAPI.getIntegrityScore(id);

      setResult({
        id: contractData.batchId,
        name: contractData.productName,
        manufacturer: contractData.manufacturer,
        status: integrity?.status || contractData.status || 'SAFE',
        date: contractData.createdAt
          ? new Date(contractData.createdAt).toLocaleDateString()
          : '',
        ...contractData,
        events: history?.events || contractData.history || [],
        integrity,
      });

      toast.success('Batch verified successfully!');
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Failed to verify batch. Please check the ID and try again.');
      setResult(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = () => {
    if (batchId) lookupBatch(batchId);
  };

  const handleScan = (scannedId) => {
    setBatchId(scannedId);
    setShowScanner(false);
    lookupBatch(scannedId);
  };

  return (
    <div className="min-h-screen w-full bg-dark-200">
      {/* Background */}
      <div className="fixed inset-0 z-0">
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
      </div>

      {/* Overlay Blur */}
      <div className="fixed inset-0 backdrop-blur-md bg-black/20 z-0"></div>

      {/* Header Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/50 backdrop-blur-xl">
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
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path);
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

      <div className="relative z-10 pt-24 min-h-screen">
        <div className="container mx-auto px-6 py-6">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Verify Product</h1>
              <p className="text-slate-400">Check the authenticity and journey of any product</p>
            </div>

            {/* Search Section (full-height, attractive) */}
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="glass-card rounded-2xl p-4 w-full max-w-none mx-0 mb-8 shadow-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900/40 to-slate-800/30 flex items-start"
            >
              <div className="flex flex-col md:flex-row items-stretch gap-8 w-full">
                {/* Search by ID */}
                <div className="flex-1">
                  <h4 className="text-sm text-slate-400 mb-3">Search by ID</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter batch ID (e.g. BATCH-001)"
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 px-4 py-3 bg-dark-200 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyber-500 transition-colors"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSearch}
                      disabled={searching}
                      className="btn-primary gap-2 px-6"
                    >
                      <Search size={16} />
                      {searching ? 'Searching...' : 'Verify'}
                    </motion.button>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Enter a numeric batch ID (e.g. 0, 1, 2) or scan a product QR code
                  </p>
                </div>

                {/* OR Divider */}
                <div className="flex items-center justify-center">
                  <div className="hidden md:flex flex-col items-center select-none">
                    <div className="w-px h-20 bg-slate-700/40 rounded" />
                    <div className="text-slate-400 my-3 font-semibold">OR</div>
                    <div className="w-px h-20 bg-slate-700/40 rounded" />
                  </div>
                  <div className="md:hidden flex items-center gap-3">
                    <div className="h-px w-20 bg-slate-700/40" />
                    <div className="text-slate-400 font-semibold">OR</div>
                    <div className="h-px w-20 bg-slate-700/40" />
                  </div>
                </div>

                {/* Scan QR Code */}
                <div className="flex-1">
                  <h4 className="text-sm text-slate-400 mb-3">Scan QR Code</h4>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowScanner(true)}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                  >
                    <Search size={20} />
                    Open Camera to Scan QR Code
                  </motion.button>
                  {showScanner && (
                    <div className="mt-4">
                      <QRScanner onScan={handleScan} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            <AnimatePresence mode="wait">
              {searching && (
                <motion.div
                  key="loading"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl bg-slate-800/30 animate-pulse"
                    />
                  ))}
                </motion.div>
              )}

              {/* Results */}
              {result && !searching && (
                <motion.div
                  key="result"
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Product Header */}
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                        <p className="text-sm text-slate-400 mt-1">
                          {result.id} · {result.manufacturer}
                        </p>
                      </div>
                      {result.integrity && (
                        <div className="w-full md:w-auto">
                          <IntegrityBadge
                            status={result.integrity.status}
                            score={result.integrity.score}
                          />
                        </div>
                      )}
                    </div>

                    {/* Tampered Warning */}
                    {result.status === 'TAMPERED' && (
                      <motion.div
                        className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <p className="text-sm font-medium text-red-400 flex items-center gap-2">
                          <AlertTriangle size={16} />
                          Integrity Compromised
                        </p>
                        <p className="text-xs text-red-400/80 mt-1">
                          An anomaly was detected in this product's supply chain. Please contact the manufacturer.
                        </p>
                      </motion.div>
                    )}

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <p className="text-slate-500 text-sm mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              result.status === 'SAFE'
                                ? 'bg-green-500'
                                : result.status === 'WARNING'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <p className="text-white font-semibold capitalize">
                            {result.status}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm mb-1">Date Created</p>
                        <p className="text-white font-semibold">{result.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {result.events && result.events.length > 0 && (
                    <div className="glass-card rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-cyber-400" />
                        Product Journey
                      </h3>
                      <Timeline events={result.events} />
                    </div>
                  )}

                  {/* Verify Another */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center pt-4"
                  >
                    <button
                      onClick={() => {
                        setResult(null);
                        setBatchId('');
                        setActiveTab('search');
                      }}
                      className="btn-secondary"
                    >
                      Verify Another Product
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
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

export default VerifyPage;
