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
      className="glass-panel rounded-3xl p-7"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest text-rose-300 font-bold">Explainability</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Evidence Visualization</h3>
          <p className="text-sm text-slate-300/80 mt-2">
            Hold to reveal original image. Release for Grad-CAM activation heatmap.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center px-4 py-2 rounded-full border border-rose-400/30 text-xs text-rose-200 bg-rose-500/10 font-semibold uppercase tracking-wider">
          Grad-CAM
        </span>
      </div>

      {!hasResult ? (
        <div className="h-96 flex items-center justify-center text-sm text-slate-400/80 rounded-2xl bg-slate-950/50 border border-slate-700/40">
          Upload and analyze an image to view evidence visualization.
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-slate-950/50 border border-slate-700/40 aspect-video max-h-[500px] shadow-inner"
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
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55">
              <div className="flex flex-col items-center space-y-2">
                <span className="h-6 w-6 border-2 border-transparent border-t-cyan-100 border-r-cyan-100 rounded-full animate-spin" />
                <p className="text-xs text-slate-200">Generating heatmap...</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-slate-950/65 backdrop-blur text-xs text-slate-100 border border-slate-100/20 flex items-center space-x-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                showOriginal ? 'bg-emerald-200' : 'bg-cyan-200'
              }`}
            />
            <span>{currentLabel}</span>
          </div>

          <div className="absolute bottom-3 left-3 text-[11px] text-slate-200 bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-100/20">
            Hold to view original image. Release to see heatmap.
          </div>
        </div>
      )}
    </motion.section>
  );
}
