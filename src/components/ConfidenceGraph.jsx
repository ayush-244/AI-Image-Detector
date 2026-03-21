import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 ${colorClass} rounded-full`}
        />
        <div className="relative h-full flex items-center px-3 text-xs text-gray-100">
          <span className="font-medium">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default function ConfidenceGraph({ realProbability, fakeProbability }) {
  const real = realProbability != null ? Number(realProbability) * 100 : 0;
  const fake = fakeProbability != null ? Number(fakeProbability) * 100 : 0;

  const hasData = real > 0 || fake > 0;

  const chartData = Array.from({ length: 21 }, (_, i) => {
    const t = i / 20;
    const easeOut = 1 - Math.pow(1 - t, 2);
    const realVal = real * easeOut;
    const fakeVal = fake * (1 - Math.pow(t, 2));
    return { x: t, real: realVal, fake: fakeVal };
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-cyan-500/20 border border-white/10"
    >
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
        <div className="space-y-6">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fakeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="x" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value.toFixed(1)}%`]}
                />
                <Area
                  type="monotone"
                  dataKey="real"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#realGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="fake"
                  stroke="#f87171"
                  strokeWidth={2}
                  fill="url(#fakeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-5">
            <BarRow label="REAL" value={real} colorClass="bg-emerald-500" />
            <BarRow label="FAKE" value={fake} colorClass="bg-red-500" />
          </div>
        </div>
      )}
    </motion.section>
  );
}
