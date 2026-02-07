import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, MapPin, Clock } from 'lucide-react';
import { formatDate, formatAddress } from '../utils/helpers';

const getActionIcon = (action) => {
  switch (action) {
    case 'CREATED':
      return <Package className="text-blue-400" size={20} />;
    case 'TRANSFERRED':
      return <Truck className="text-yellow-400" size={20} />;
    case 'CONFIRMED':
      return <CheckCircle className="text-green-400" size={20} />;
    default:
      return <Package className="text-slate-400" size={20} />;
  }
};

const getActionLabel = (action) => {
  switch (action) {
    case 'CREATED':
      return 'Batch Created';
    case 'TRANSFERRED':
      return 'Transferred';
    case 'CONFIRMED':
      return 'Confirmed Receipt';
    default:
      return action;
  }
};

const Timeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Package size={48} className="mx-auto mb-4 opacity-50" />
        <p>No history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Connector Line */}
          {index < events.length - 1 && (
            <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-cyber-500 to-transparent" />
          )}

          <div className="flex gap-4">
            {/* Icon */}
            <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-dark-100 border-2 border-cyber-500 flex items-center justify-center">
              {getActionIcon(event.action)}
            </div>

            {/* Content */}
            <div className="flex-1 glass-card p-4 hover:border-cyber-500/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {getActionLabel(event.action)}
                  </h4>
                  <p className="text-sm text-slate-400 font-mono">
                    {formatAddress(event.handler)}
                  </p>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(event.timestamp)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin size={14} className="text-cyber-400" />
                <span>{event.location}</span>
              </div>

              {/* Additional Data */}
              {(event.temperature || event.humidity) && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex gap-4 text-xs text-slate-400">
                  {event.temperature && (
                    <div className="flex items-center gap-1">
                      <span className="text-cyan-400">🌡️</span>
                      <span>{event.temperature}°C</span>
                    </div>
                  )}
                  {event.humidity && (
                    <div className="flex items-center gap-1">
                      <span className="text-blue-400">💧</span>
                      <span>{event.humidity}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
