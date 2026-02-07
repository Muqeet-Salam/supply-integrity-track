import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, ShieldCheck, AlertTriangle } from 'lucide-react';
// No routing from dashboard items per user request
import StatCard from '../components/StatCard';
import AlertBanner from '../components/AlertBanner';
import IntegrityBadge from '../components/IntegrityBadge';
import { mockBatches, recentAlerts } from '../data/mockData';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const ConsumerDashboard = () => {
  const [alerts, setAlerts] = useState(recentAlerts);

  const handleDismissAlert = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  const statistics = [
    {
      title: 'Active Batches',
      value: 42,
      subtitle: '+3 today',
      icon: Package,
    },
    {
      title: 'In Transit',
      value: 18,
      subtitle: 'Across 7 routes',
      icon: Truck,
    },
    {
      title: 'Verified',
      value: 38,
      subtitle: '90.5% integrity',
      icon: ShieldCheck,
    },
    {
      title: 'Alerts',
      value: alerts.length,
      subtitle: alerts.some((a) => a.severity === 'MEDIUM') ? '1 critical' : 'All clear',
      icon: AlertTriangle,
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-2">Real-time supply chain overview and product verification</p>
      </motion.div>

      {/* Statistics Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statistics.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
          />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Batches Section */}
        <motion.div
          variants={item}
          className="lg:col-span-2 glass-card rounded-xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Batches</h2>
              <p className="text-xs text-slate-500 mt-1">Verify product authenticity and origin</p>
            </div>
          </div>

          <div className="space-y-3">
            {mockBatches.map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 transition-all border border-slate-700/30 group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate transition-colors">
                    {batch.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {batch.id} · {batch.manufacturer}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      batch.status === 'SAFE'
                        ? 'bg-green-500/10 text-green-400'
                        : batch.status === 'WARNING'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Alerts Section */}
        <motion.div
          variants={item}
          className="glass-card rounded-xl p-6 border border-slate-700/50"
        >
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Recent Alerts</h2>
            {alerts.length > 0 ? (
              <AlertBanner
                alerts={alerts}
                onDismiss={handleDismissAlert}
              />
            ) : (
              <div className="text-center py-8">
                <ShieldCheck size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">All batches verified and secure</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConsumerDashboard;
