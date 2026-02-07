import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const AlertBanner = ({ alerts = [], onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id || index}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              flex items-start gap-3 p-4 rounded-xl border-l-4
              ${alert.severity === 'HIGH' ? 'bg-red-500/10 border-red-500' : ''}
              ${alert.severity === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500' : ''}
              ${alert.severity === 'LOW' ? 'bg-blue-500/10 border-blue-500' : ''}
            `}
          >
            <AlertTriangle
              size={20}
              className={`flex-shrink-0 mt-0.5 ${
                alert.severity === 'HIGH' ? 'text-red-400' : ''
              } ${alert.severity === 'MEDIUM' ? 'text-yellow-400' : ''} ${
                alert.severity === 'LOW' ? 'text-blue-400' : ''
              }`}
            />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {alert.type || 'Alert'}
                  </h4>
                  <p className="text-sm text-slate-300">{alert.message}</p>
                  {alert.timestamp && (
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>

                {onDismiss && (
                  <button
                    onClick={() => onDismiss(index)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default AlertBanner;
