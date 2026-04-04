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
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-slate-200 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-bold text-slate-100">
          {Number.isFinite(value) ? `${value.toFixed(1)}%` : '—'}
        </p>
      </div>
      <div className="relative h-8 rounded-full bg-slate-800/50 overflow-hidden border border-slate-700/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 ${colorClass} rounded-full shadow-lg`}
        />
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
      className="glass-panel rounded-3xl p-7"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-white">Confidence Distribution</h2>
          <p className="text-sm text-slate-300/80 mt-1">
            REAL vs FAKE probability comparison for this image analysis.
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-40 flex items-center justify-center text-sm text-slate-400/80 rounded-xl bg-slate-950/30 border border-slate-700/40">
          Run an analysis to view confidence distribution.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#73f0cf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fakeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,176,255,0.12)" />
                <XAxis dataKey="x" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 7, 14, 0.95)',
                    border: '1px solid rgba(139, 176, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#f0f4f8',
                    padding: '8px 12px',
                  }}
                  formatter={(value) => [`${value.toFixed(1)}%`]}
                />
                <Area
                  type="monotone"
                  dataKey="real"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#realGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="fake"
                  stroke="#ef4444"
                  strokeWidth={2.5}
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
