import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card p-6 rounded-xl border border-slate-700/50 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="p-3 rounded-lg bg-cyber-500/10 group-hover:bg-cyber-500/20 transition-colors">
          <Icon size={24} className="text-cyber-400" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
