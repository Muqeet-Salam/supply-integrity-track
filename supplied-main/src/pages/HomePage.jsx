import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Factory, Boxes, ShoppingBag, User, ArrowRight } from 'lucide-react';
import RainbowShield from '../components/RainbowShield';
import WalletConnect from '../components/WalletConnect';
import { useApp } from '../context/AppContext';  
import FloatingLines from '../components/FloatingLines';

const HomePage = () => {
  const navigate = useNavigate();
  const { walletAddress } = useApp();

  const features = [
    {
      icon: Factory,
      title: 'Manufacturer',
      description: 'Create and track product batches from origin',
      color: 'text-white',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: Boxes,
      title: 'Distributor',
      description: 'Transfer custody and maintain chain integrity',
      color: 'text-white',
      bgColor: 'bg-yellow-500/20',
    },
    {
      icon: ShoppingBag,
      title: 'Retailer',
      description: 'Confirm receipt and prepare for consumers',
      color: 'text-white',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: User,
      title: 'Consumer',
      description: 'Verify authenticity and product provenance',
      color: 'text-white',
      bgColor: 'bg-red-500/20',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <FloatingLines 
            enabledWaves={["top","middle","bottom"]}
            linesGradient={["#ff5f6d","#ffc371","#ffd166","#38b6ff","#7c4dff","#ff66c4"]}
            // Array - specify line count per wave; Number - same count for all waves
            lineCount={5}
            // Array - specify line distance per wave; Number - same distance for all waves
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b  rounded-full border-slate-800/50 backdrop-blur-xl sticky top-1 z-40">
        <div className="container px-10 py-4 flex items-center justify-between align-middle gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <RainbowShield size={32} className="" />
            <div>
              <h1 className="text-xl font-bold font-display text-white">
                SUPPLY CHAIN
              </h1>
              <p className="text-xs font-mono" >INTEGRITY TRACKER</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <WalletConnect />
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Effects */}
        {/* <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" /> */}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6 px-6 py-2 bg-red-500/15 border border-red-400/30 rounded-full"
            >
              <span className="text-red-300 text-sm font-mono font-semibold">
                BLOCKCHAIN-POWERED VERIFICATION
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 text-glow">
              Secure Your
              <br />
              <span className="rainbow-text">Supply Chain</span>
            </h1>

            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Track, verify, and ensure the integrity of your products from
              manufacturer to consumer with blockchain technology.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/role-selection')}
              className="btn-primary text-lg px-8 py-4"
            >
              {walletAddress ? (
                <>
                  Get Started
                  <ArrowRight size={20} className="ml-2" />
                </>
              ) : (
                'Connect Wallet to Continue'
              )}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Built for Every Stakeholder
            </h2>
            <p className="text-slate-400 text-lg">
              From production to purchase, transparency at every step
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`p-6 text-center group rounded-lg border border-slate-700/20 ${feature.bgColor} hover:shadow-lg transition-all duration-200`}
              >
                <div className={`inline-flex p-3 rounded-full bg-slate-800/20 mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm mb-2">© 2026 Supply Chain Integrity Tracker. Powered by Blockchain.</p>
          <p className="text-white text-sm">Made with 💗 by Gigachads</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default HomePage;
