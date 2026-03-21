import React from 'react';
import { motion } from 'framer-motion';

export default function ExplanationPanel({ explanation, hasResult }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-cyan-500/20 border border-white/10 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">AI Technical Explanation</h2>
          <p className="text-sm text-gray-400 mt-1">
            Dive into the model&apos;s reasoning across feature maps, activation clusters,
            and anomaly patterns.
          </p>
        </div>
      </div>

      <div className="mt-2 flex-1 min-h-[140px] max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {!hasResult ? (
          <p className="text-sm text-gray-500 leading-relaxed">
            Run an analysis to view a detailed explanation of how the detector arrived at
            its decision. The model will summarize which regions and statistical
            signatures most strongly contributed to the REAL vs FAKE verdict.
          </p>
        ) : explanation ? (
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line font-light tracking-wide">
            {explanation}
          </p>
        ) : (
          <p className="text-sm text-gray-500 leading-relaxed">
            The backend did not return a detailed explanation for this sample.
          </p>
        )}
      </div>
    </motion.section>
  );
}
