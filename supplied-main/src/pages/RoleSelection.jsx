import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, Store, Shield, ArrowLeft, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLES } from '../utils/constants';
import { toast } from 'react-hot-toast';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { selectRole, walletAddress } = useApp();

  const roles = [
    {
      id: ROLES.MANUFACTURER,
      icon: Package,
      title: 'Manufacturer',
      description: 'Create product batches and initiate tracking',
      features: ['Create batches', 'Generate QR codes', 'Set initial data'],
      gradient: 'from-blue-500 to-cyan-500',
      route: '/manufacturer-login',
    },
    {
      id: ROLES.DISTRIBUTOR,
      icon: Truck,
      title: 'Distributor',
      description: 'Transfer custody and maintain chain integrity',
      features: ['Scan batches', 'Transfer ownership', 'Update location'],
      gradient: 'from-yellow-500 to-orange-500',
      route: '/distributor-login',
    },
    {
      id: ROLES.CONSUMER,
      icon: Wallet,
      title: 'Consumer',
      description: 'Verify product authenticity and provenance',
      features: ['Scan QR codes', 'View history', 'Check integrity'],
      gradient: 'from-purple-500 to-pink-500',
      route: '/consumer-dashboard',
    },
  ];

  const handleRoleSelect = async (role) => {
    // Allow access to login pages and consumer dashboard without wallet
    if (role.id === ROLES.CONSUMER || role.route.includes('login')) {
      try {
        if (role.id !== ROLES.CONSUMER) {
          await selectRole(role.id);
        }
        navigate(role.route);
      } catch (error) {
        console.error('Failed to select role:', error);
      }
      return;
    }

    // For other roles, wallet is required (though login pages provide alternatives)
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      navigate('/');
      return;
    }

    try {
      await selectRole(role.id);
      navigate(role.route);
    } catch (error) {
      console.error('Failed to select role:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Select Your Role
          </h1>
          <p className="text-xl text-slate-400">
            Choose how you'll interact with the supply chain
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              onClick={() => handleRoleSelect(role)}
              className="glass-card p-6 cursor-pointer group relative overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon */}
              <div
                className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${role.gradient} mb-6`}
              >
                <role.icon size={32} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-2 relative">
                {role.title}
              </h3>
              <p className="text-slate-400 mb-6 text-sm relative">
                {role.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 relative">
                {role.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-400" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 max-w-2xl mx-auto mt-12 text-center"
        >
          <Wallet className="text-cyber-400 mx-auto mb-3" size={32} />
          <p className="text-slate-300">
            Your wallet is connected as{' '}
            <span className="text-cyber-400 font-mono">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </span>
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Select a role to access the appropriate dashboard
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;
