import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

const IntegrityBadge = ({ status, score }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'SAFE':
        return {
          icon: Shield,
          label: 'Verified Safe',
          bgColor: 'bg-status-safe',
          textColor: 'text-white',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          Icon: CheckCircle,
        };
      case 'WARNING':
        return {
          icon: AlertTriangle,
          label: 'Warning',
          bgColor: 'bg-status-warning',
          textColor: 'text-white',
          glowColor: 'rgba(245, 158, 11, 0.3)',
          Icon: AlertTriangle,
        };
      case 'TAMPERED':
        return {
          icon: XCircle,
          label: 'Tampered',
          bgColor: 'bg-status-tampered',
          textColor: 'text-white',
          glowColor: 'rgba(220, 38, 38, 0.3)',
          Icon: XCircle,
        };
      default:
        return {
          icon: Shield,
          label: 'Unknown',
          bgColor: 'bg-slate-600',
          textColor: 'text-white',
          glowColor: 'rgba(100, 116, 139, 0.3)',
          Icon: Shield,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.Icon;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div
        className={`${config.bgColor} rounded-2xl p-6 relative overflow-hidden`}
        style={{
          boxShadow: `0 0 40px ${config.glowColor}`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: status === 'SAFE' ? 0 : [0, -10, 10, -10, 0] }}
              transition={{
                duration: 0.5,
                repeat: status === 'TAMPERED' ? Infinity : 0,
                repeatDelay: 1,
              }}
            >
              <Icon size={40} className={config.textColor} />
            </motion.div>
            <div>
              <h3 className={`text-2xl font-bold ${config.textColor}`}>
                {config.label}
              </h3>
              {score !== undefined && (
                <p className={`text-sm ${config.textColor} opacity-90 mt-1`}>
                  Integrity Score: {score}/100
                </p>
              )}
            </div>
          </div>

          {/* Score Circle */}
          {score !== undefined && (
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{
                    strokeDasharray: 283,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{score}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IntegrityBadge;
