import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { Camera, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { parseBatchIdFromLink } from '../utils/helpers';

const QRScanner = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [cameraMode, setCameraMode] = useState(true);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (cameraMode && !scannerRef.current) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [cameraMode]);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          const batchId = parseBatchIdFromLink(decodedText);
          toast.success('QR Code scanned!');
          onScan(batchId);
          stopScanner();
        },
        (error) => {
          // Ignore scanning errors (they're constant)
        }
      );

      setScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast.error("Failed to start camera. Please check permissions.");
      setCameraMode(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-file");
      const result = await html5QrCode.scanFile(file, true);
      const batchId = parseBatchIdFromLink(result);
      toast.success('QR Code decoded!');
      onScan(batchId);
    } catch (err) {
      console.error("Error scanning file:", err);
      toast.error("Failed to decode QR code from image");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              stopScanner();
              setCameraMode(true);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              cameraMode
                ? 'bg-cyber-500 text-white'
                : 'bg-dark-100 text-slate-400 hover:bg-dark-50'
            }`}
          >
            <Camera size={20} className="inline mr-2" />
            Camera
          </button>
          <button
            onClick={() => {
              stopScanner();
              setCameraMode(false);
              fileInputRef.current?.click();
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              !cameraMode
                ? 'bg-cyber-500 text-white'
                : 'bg-dark-100 text-slate-400 hover:bg-dark-50'
            }`}
          >
            <Upload size={20} className="inline mr-2" />
            Upload
          </button>
        </div>

        {/* Scanner Container */}
        <div className="relative rounded-xl overflow-hidden bg-dark-100">
          {cameraMode ? (
            <div id="qr-reader" className="w-full" />
          ) : (
            <div id="qr-reader-file" className="w-full p-12 text-center">
              <Upload size={48} className="mx-auto mb-4 text-slate-500" />
              <p className="text-slate-400 mb-4">Click "Upload" to select QR code image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Scan Frame Overlay */}
          {cameraMode && scanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-2 border-cyber-500" style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 20%, 80% 20%, 80% 80%, 100% 80%, 100% 100%, 0 100%, 0 80%, 20% 80%, 20% 20%, 0 20%)',
              }} />
            </div>
          )}
        </div>

        {/* Instructions */}
        {cameraMode && scanning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-slate-400 mt-4"
          >
            Position the QR code within the frame
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QRScanner;