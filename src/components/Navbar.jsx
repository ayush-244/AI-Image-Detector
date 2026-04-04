import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar({ onScrollTo }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <nav className="max-w-6xl mx-auto glass-panel rounded-2xl px-3 sm:px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center border border-purple-300/40 shadow-lg shadow-purple-500/30">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white font-bold tracking-tight leading-tight truncate bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">AuthenticAI</p>
            <p className="text-[11px] text-slate-400 leading-tight">Enterprise Image Verification</p>
          </div>
        </div>

        <div className="hidden sm:flex flex-1 justify-center max-w-2xl">
          <div className="flex items-center gap-1 bg-slate-900/30 border border-purple-400/20 rounded-full px-2 py-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => onScrollTo('hero')}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-all rounded-full hover:bg-purple-500/15 font-medium"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('upload')}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-all rounded-full hover:bg-purple-500/15 font-medium"
            >
              Analyze
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('results')}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-all rounded-full hover:bg-purple-500/15 font-medium"
            >
              Results
            </button>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onScrollTo('upload')}
          className="shrink-0 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white text-sm font-bold shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all"
        >
          Get Started
        </motion.button>
      </nav>
      <div className="sm:hidden max-w-6xl mx-auto mt-3 flex justify-center">
        <div className="glass-panel flex items-center gap-1 rounded-full px-2 py-1">
          {['hero', 'upload', 'results'].map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => onScrollTo(id)}
              className="px-3 py-1.5 text-xs text-slate-200 rounded-full hover:bg-white/10"
            >
              {['Home', 'Analyze', 'Results'][i]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
