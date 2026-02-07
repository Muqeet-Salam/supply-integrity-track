import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, X, Home, Package, Truck, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { ROLES } from '../utils/constants';
import FloatingLines from '../components/FloatingLines';
import RainbowShield from '../components/RainbowShield';

const DistributorLogin = () => {
  const navigate = useNavigate();
  const { connectWallet, selectRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletConnect = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        await selectRole(ROLES.DISTRIBUTOR);
        toast.success('Wallet connected! Redirecting...');
        navigate('/distributor');
      }
    } catch (err) {
      // connectWallet shows errors
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Login successful!');
      navigate('/distributor');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
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
        <div className="absolute inset-0 backdrop-blur-md bg-black/40"></div>
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-slate-800/50 backdrop-blur-xl">
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

      {/* Modal Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-96 p-8 rounded-xl border border-slate-700/50 relative shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-1 hover:bg-slate-700/50 rounded transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Distributor Login</h2>
            <p className="text-slate-400 text-sm">Choose your login method</p>
          </div>

          {/* Connect Wallet Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWalletConnect}
            className="btn-secondary w-full mb-4 flex items-center justify-center gap-2"
          >
            <Wallet size={18} />
            Connect Wallet
          </motion.button>

          {/* OR Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-slate-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-secondary w-full"
            >
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </motion.button>
          </form>

          {/* Back Link */}
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-slate-400 hover:text-white text-sm transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DistributorLogin;
