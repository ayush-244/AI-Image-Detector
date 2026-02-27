import React from 'react';

export default function ExplanationPanel({ explanation, hasResult }) {
  return (
    <section className="bg-card rounded-2xl p-6 shadow-md border border-white/5 flex flex-col">
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
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
            {explanation}
          </p>
        ) : (
          <p className="text-sm text-gray-500 leading-relaxed">
            The backend did not return a detailed explanation for this sample.
          </p>
        )}
      </div>
    </section>
  );
}

