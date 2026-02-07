import React, { useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

const QRDisplay = ({ value, label, size = 160, showDownload = false }) => {
  const canvasWrapperRef = useRef(null);

  const handleDownload = useCallback(() => {
    const canvas = canvasWrapperRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${label || 'batch'}.png`;
    a.click();
  }, [label]);

  if (!value) {
    return (
      <div className="inline-block text-center">
        <div
          style={{ width: size, height: size }}
          className="bg-white/5 rounded-md flex items-center justify-center mb-2 border border-slate-700"
        >
          <div className="text-xs text-slate-300 px-3">No QR data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-block text-center">
      <div
        ref={canvasWrapperRef}
        style={{ width: size, height: size }}
        className="bg-white rounded-lg flex items-center justify-center mb-2 p-1 mx-auto"
      >
        <QRCodeCanvas
          value={String(value)}
          size={size - 8}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          includeMargin={false}
        />
      </div>
      {label && (
        <div className="text-xs text-slate-400 font-mono mt-1">{label}</div>
      )}
      {showDownload && (
        <button
          onClick={handleDownload}
          className="mt-2 inline-flex items-center gap-1 text-xs text-cyber-400 hover:text-cyber-300 transition-colors"
        >
          <Download size={12} />
          Download QR
        </button>
      )}
    </div>
  );
};

export default QRDisplay;
