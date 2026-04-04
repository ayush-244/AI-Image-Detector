import React from 'react';
import { motion } from 'framer-motion';

function Badge({ label }) {
  const isReal = label === 'REAL';
  const colorClass = isReal
    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-400/35'
    : 'bg-rose-500/15 text-rose-700 dark:text-rose-200 border-rose-400/35';

  return (
    <span
      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${colorClass} uppercase tracking-wider`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          isReal ? 'bg-emerald-400' : 'bg-rose-400'
        }`}
      />
      {label || '—'}
    </span>
  );
}

function ProgressBar({ value, colorClass }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="w-full h-3 rounded-full bg-slate-300/50 dark:bg-slate-800/50 overflow-hidden border border-slate-400/40 dark:border-slate-700/40">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  );
}

const cardStyle =
  'glass-panel rounded-3xl p-7 hover:border-purple-400/40 transition-all';

export default function StatsCards({ result }) {
  const {
    label,
    confidence,
    real_probability,
    fake_probability,
    inference_time_ms,
    activation_strength,
    model_version,
  } = result || {};

  const confidenceValue = confidence != null ? Number(confidence) : null;
  const realProb = real_probability != null ? Number(real_probability) * 100 : null;
  const fakeProb = fake_probability != null ? Number(fake_probability) * 100 : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${cardStyle} flex flex-col justify-between min-h-[280px]`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-purple-600 dark:text-purple-300 font-bold">AI Verdict</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-4">Prediction</h3>
          <div className="mt-5">
            <Badge label={label} />
          </div>
          <p className="mt-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Neural network classification of pixel and feature-space patterns.
          </p>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-300/50 dark:border-slate-700/50">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Overall Confidence</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {confidenceValue != null ? `${confidenceValue.toFixed(1)}%` : '—'}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`${cardStyle} flex flex-col justify-between min-h-[280px]`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-300 font-bold">Probabilities</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-4">Confidence Breakdown</h3>
          <div className="mt-3 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Real</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
                  {realProb != null ? `${realProb.toFixed(1)}%` : '—'}
                </p>
              </div>
              <ProgressBar value={realProb} colorClass="bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Fake</p>
                <p className="text-sm font-bold text-red-600 dark:text-red-300">
                  {fakeProb != null ? `${fakeProb.toFixed(1)}%` : '—'}
                </p>
              </div>
              <ProgressBar value={fakeProb} colorClass="bg-red-500" />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-300/50 dark:border-slate-700/50">
          <p className="text-xs text-slate-600 dark:text-slate-400">Calibrated logit normalization</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardStyle} flex flex-col justify-between min-h-[280px]`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-300 font-bold">Metadata</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-4">Inference Stats</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Inference Time</dt>
              <dd className="text-lg font-bold text-slate-900 dark:text-white">
                {inference_time_ms != null ? `${inference_time_ms}ms` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Activation Strength</dt>
              <dd className="text-lg font-bold text-slate-900 dark:text-white">
                {activation_strength != null ? activation_strength : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Model Version</dt>
              <dd className="text-lg font-bold text-slate-900 dark:text-white">
                {model_version || '—'}
              </dd>
            </div>
          </dl>
        </div>
      </motion.div>
    </>
  );
}
