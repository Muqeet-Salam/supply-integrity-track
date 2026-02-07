import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-cyber-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 border-4 border-transparent border-t-cyber-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Center Dot */}
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 bg-cyber-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-200/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
