import React from 'react';
import { motion } from 'framer-motion';

function Badge({ label }) {
  const isReal = label === 'REAL';
  const colorClass = isReal
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
    : 'bg-red-500/15 text-red-300 border-red-500/40';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          isReal ? 'bg-emerald-400' : 'bg-red-400'
        }`}
      />
      {label || '—'}
    </span>
  );
}

function ProgressBar({ value, colorClass }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  );
}

const cardStyle =
  'bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-cyan-500/20 border border-white/10 hover:border-cyan-500/20 transition-colors';

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
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${cardStyle} flex flex-col justify-between`}
      >
        <div>
          <p className="text-sm text-gray-400">Prediction</p>
          <div className="mt-3 flex items-center justify-between">
            <Badge label={label} />
            <p className="text-xs text-gray-500">AI verdict</p>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            The detector evaluates pixel-level and feature-space patterns to classify the
            image as REAL or FAKE.
          </p>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">Overall confidence</p>
            <p className="mt-1 text-2xl font-bold">
              {confidenceValue != null ? `${confidenceValue.toFixed(1)}%` : '—'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cardStyle}
      >
        <p className="text-sm text-gray-400">Confidence breakdown</p>
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Real probability</p>
              <p className="text-xs font-medium text-emerald-300">
                {realProb != null ? `${realProb.toFixed(1)}%` : '—'}
              </p>
            </div>
            <ProgressBar value={realProb} colorClass="bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Fake probability</p>
              <p className="text-xs font-medium text-red-300">
                {fakeProb != null ? `${fakeProb.toFixed(1)}%` : '—'}
              </p>
            </div>
            <ProgressBar value={fakeProb} colorClass="bg-red-500" />
          </div>
        </div>
        <p className="mt-4 text-[11px] text-gray-500">
          Probabilities are normalized across the classifier&apos;s internal logits to
          provide a calibrated confidence profile.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cardStyle}
      >
        <p className="text-sm text-gray-400">Inference stats</p>
        <dl className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <dt className="text-xs text-gray-400">Inference time</dt>
              <dd className="text-sm font-semibold">
                {inference_time_ms != null ? `${inference_time_ms} ms` : '—'}
              </dd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <dt className="text-xs text-gray-400">Activation strength</dt>
              <dd className="text-sm font-semibold">
                {activation_strength != null ? activation_strength : '—'}
              </dd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <dt className="text-xs text-gray-400">Model version</dt>
              <dd className="text-sm font-semibold">
                {model_version || '—'}
              </dd>
            </div>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}
