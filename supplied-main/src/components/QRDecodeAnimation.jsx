import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateMatrixString } from '../utils/helpers';

const QRDecodeAnimation = ({ value, size = 256, onComplete }) => {
  const [isDecoding, setIsDecoding] = useState(true);
  const [decodedBlocks, setDecodedBlocks] = useState([]);
  const gridSize = 8; // 8x8 grid of blocks
  const totalBlocks = gridSize * gridSize;

  useEffect(() => {
    if (!isDecoding) return;

    // Decode blocks sequentially with random effect
    const decodeSequence = async () => {
      const blocks = Array.from({ length: totalBlocks }, (_, i) => i);
      
      // Shuffle blocks for random decode effect
      for (let i = blocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
      }

      // Decode each block with delay
      for (let i = 0; i < blocks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        setDecodedBlocks(prev => [...prev, blocks[i]]);
      }

      // Wait a bit then finish
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsDecoding(false);
      onComplete?.();
    };

    decodeSequence();
  }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background QR Code (hidden during decode) */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDecoding ? 'opacity-0' : 'opacity-100'}`}>
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          includeMargin={false}
          className="w-full h-full"
        />
      </div>

      {/* Decoding Animation Overlay */}
      <AnimatePresence>
        {isDecoding && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              gap: '2px',
            }}
          >
            {Array.from({ length: totalBlocks }, (_, index) => {
              const isDecoded = decodedBlocks.includes(index);
              
              return (
                <motion.div
                  key={index}
                  className={`relative overflow-hidden ${
                    isDecoded ? 'bg-transparent' : 'bg-dark-100'
                  }`}
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: isDecoded ? 0 : 1,
                    scale: isDecoded ? 0.8 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {!isDecoded && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{
                        color: ['#0891b2', '#06b6d4', '#0891b2'],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                      }}
                    >
                      <span className="text-[8px] font-mono font-bold text-cyber-500">
                        {generateMatrixString(2)}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Line Effect */}
      {isDecoding && (
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-400 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
          }}
        />
      )}

      {/* Corner Brackets */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left */}
        <motion.div
          className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-500"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        />
        {/* Top Right */}
        <motion.div
          className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-500"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        />
        {/* Bottom Left */}
        <motion.div
          className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-500"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        />
        {/* Bottom Right */}
        <motion.div
          className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-500"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        />
      </div>

      {/* Decoding Status Text */}
      {isDecoding && (
        <motion.div
          className="absolute -bottom-12 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-cyber-400 text-sm font-mono flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-cyber-400 rounded-full animate-pulse" />
            DECODING QR CODE...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QRDecodeAnimation;
