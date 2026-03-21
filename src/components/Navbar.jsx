import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar({ onScrollTo }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
            <span className="text-sm font-bold text-cyan-400">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight truncate">NextWare AI</span>
        </div>

        <div className="hidden sm:flex flex-1 justify-center max-w-xl">
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5">
            <button
              type="button"
              onClick={() => onScrollTo('hero')}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('upload')}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              Analyze
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('results')}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
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
          className="shrink-0 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-black text-sm font-semibold shadow-lg shadow-cyan-500/20"
        >
          Start Now
        </motion.button>
      </nav>
      <div className="sm:hidden max-w-6xl mx-auto mt-3 flex justify-center">
        <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1">
          {['hero', 'upload', 'results'].map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => onScrollTo(id)}
              className="px-3 py-1.5 text-xs text-gray-300 rounded-full hover:bg-white/10"
            >
              {['Home', 'Analyze', 'Results'][i]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
