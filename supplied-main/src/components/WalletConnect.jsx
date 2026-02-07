import React from 'react';
import { Wallet, LogOut, Truck, Store, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatAddress } from '../utils/helpers';

const WalletConnect = () => {
  const { walletAddress, disconnectWallet } = useApp();
  const navigate = useNavigate();

  if (walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card px-4 py-2 flex items-center gap-3"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="font-mono text-sm text-slate-300">
          {formatAddress(walletAddress)}
        </span>
        <button
          onClick={disconnectWallet}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
          title="Disconnect"
        >
          <LogOut size={16} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/consumer-dashboard')}
        className="top-nav-btn flex items-center gap-2"
      >
        <Wallet size={20} />
        <span>Consumer</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/manufacturer-login')}
        className="top-nav-btn flex items-center gap-2"
      >
        <Store size={20} />
        Manufacturer
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/distributor-login')}
        className="top-nav-btn flex items-center gap-2"
      >
        <Truck size={20} />
        Distributor
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/verify')}
        className="top-nav-btn flex items-center gap-2"
      >
        <Search size={20} />
        Verify
      </motion.button>
    </div>
  );
};

export default WalletConnect;
