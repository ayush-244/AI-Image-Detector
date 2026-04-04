import React from 'react';
import { motion } from 'framer-motion';

export default function ExplanationPanel({ explanation, hasResult }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-panel rounded-3xl p-7 flex flex-col min-h-[280px]"
    >
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">AI Insights</span>
        </div>
        <h3 className="text-xl font-bold text-white">Technical Analysis</h3>
      </div>

      <div className="flex-1 min-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
        {!hasResult ? (
          <p className="text-sm text-slate-400/90 leading-relaxed">
            Detailed model reasoning on decision pathways, confidence factors, and evidence patterns will appear after analysis.
          </p>
        ) : explanation ? (
          <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-line font-light tracking-tight">
            {explanation}
          </p>
        ) : (
          <p className="text-sm text-slate-400/80 leading-relaxed">
            Technical explanation unavailable for this analysis.
          </p>
        )}
      </div>
    </motion.section>
  );
}
