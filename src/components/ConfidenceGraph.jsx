import React from 'react';

export default function ConfidenceGraph({ realProbability, fakeProbability }) {
  const real = realProbability != null ? Number(realProbability) * 100 : null;
  const fake = fakeProbability != null ? Number(fakeProbability) * 100 : null;

  const hasData = real != null || fake != null;

  return (
    <section className="bg-card rounded-2xl p-6 shadow-md border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Class confidence comparison</h2>
          <p className="text-sm text-gray-400 mt-1">
            Visual comparison between REAL and FAKE probabilities for this image.
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-32 flex items-center justify-center text-sm text-gray-500">
          Run an analysis to view confidence distribution.
        </div>
      ) : (
        <div className="space-y-5">
          <BarRow label="REAL" value={real} colorClass="bg-emerald-500" />
          <BarRow label="FAKE" value={fake} colorClass="bg-red-500" />
        </div>
      )}
    </section>
  );
}

function BarRow({ label, value, colorClass }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xs text-gray-300 font-medium">
          {Number.isFinite(value) ? `${value.toFixed(1)}%` : '—'}
        </p>
      </div>
      <div className="relative h-7 rounded-full bg-slate-900/70 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${colorClass} rounded-full transition-all duration-500`}
          style={{ width: `${safeValue}%` }}
        />
        <div className="relative h-full flex items-center px-3 text-xs text-gray-100">
          <span className="font-medium">{label}</span>
        </div>
      </div>
    </div>
  );
}

