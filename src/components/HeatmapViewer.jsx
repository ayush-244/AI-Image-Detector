import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function HeatmapViewer({ originalUrl, heatmapUrl, hasResult, isLoading }) {
  const [showOriginal, setShowOriginal] = useState(false);

  const handlePressStart = () => {
    if (!hasResult || isLoading) return;
    setShowOriginal(true);
  };

  const handlePressEnd = () => {
    setShowOriginal(false);
  };

  const currentLabel = showOriginal ? 'Original View' : 'Heatmap View';

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-cyan-500/20 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Heatmap viewer</h2>
          <p className="text-sm text-gray-400 mt-1">
            Hold to reveal the original image. Release to switch back to the AI activation
            heatmap.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full border border-white/10 text-[11px] text-gray-300 bg-white/5">
          Premium interpretability
        </span>
      </div>

      {!hasResult ? (
        <div className="h-48 flex items-center justify-center text-sm text-gray-500 rounded-xl bg-black/20 border border-white/5">
          Upload and analyze an image to view the heatmap overlay.
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 aspect-video max-h-[420px] shadow-inner"
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePressStart();
          }}
          onTouchEnd={handlePressEnd}
        >
          {heatmapUrl && (
            <img
              src={heatmapUrl}
              alt="Heatmap"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {originalUrl && (
            <img
              src={originalUrl}
              alt="Original"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                showOriginal ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center space-y-2">
                <span className="h-6 w-6 border-2 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin" />
                <p className="text-xs text-gray-200">Generating heatmap...</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-xs text-gray-100 border border-white/15 flex items-center space-x-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                showOriginal ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <span>{currentLabel}</span>
          </div>

          <div className="absolute bottom-3 left-3 text-[11px] text-gray-300 bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
            Hold to view original image. Release to see heatmap.
          </div>
        </div>
      )}
    </motion.section>
  );
}
