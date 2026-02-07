import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Topbarcd = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Temperature Alert',
      message: 'Batch BATCH-001 detected temperature deviation during transit.',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      type: 'Location Update',
      message: 'BATCH-002 arrived at destination warehouse.',
      severity: 'LOW',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 3,
      type: 'Integrity Warning',
      message: 'Unusual QR code scan pattern detected on BATCH-003.',
      severity: 'MEDIUM',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 4,
      type: 'Batch Created',
      message: 'New batch BATCH-004 successfully created and registered.',
      severity: 'LOW',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
  ]);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500/10 text-red-400 border-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500';
      case 'LOW':
        return 'bg-blue-500/10 text-blue-400 border-blue-500';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500';
    }
  };

  return (
    <header className="w-full py-4 px-6 border-b border-slate-800/50 bg-transparent sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <Bell size={25} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-96 glass-card rounded-lg shadow-2xl border border-slate-700/50 max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                  <h3 className="font-semibold text-white">Alerts & Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                  >
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>

                {/* Notifications List */}
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-700/50">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-l-4 ${getSeverityColor(notification.severity)} cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-start gap-3`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm mb-1">{notification.type}</p>
                          <p className="text-xs text-slate-300 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="p-1 hover:bg-white/10 rounded flex-shrink-0"
                        >
                          <X size={16} className="text-slate-400 hover:text-white" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell size={32} className="mx-auto mb-3 text-slate-500" />
                    <p className="text-slate-400 text-sm">No new notifications</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbarcd;