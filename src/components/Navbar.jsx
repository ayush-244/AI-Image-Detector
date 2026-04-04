import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onScrollTo }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <nav className="max-w-6xl mx-auto glass-panel rounded-2xl px-3 sm:px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center border border-purple-300/40 dark:border-purple-300/40 shadow-lg shadow-purple-500/30">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white dark:text-white font-bold tracking-tight leading-tight truncate bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 dark:from-purple-200 dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">AuthenticAI</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Enterprise Verification</p>
          </div>
        </div>

        <div className="hidden sm:flex flex-1 justify-center max-w-2xl">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-900/40 border border-slate-300/40 dark:border-purple-400/30 rounded-full px-2 py-1.5 backdrop-blur-sm dark:backdrop-blur-md">
            <button
              type="button"
              onClick={() => onScrollTo('hero')}
              className="px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-white transition-all rounded-full hover:bg-indigo-100/60 dark:hover:bg-purple-500/20 font-medium"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('upload')}
              className="px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-white transition-all rounded-full hover:bg-indigo-100/60 dark:hover:bg-purple-500/20 font-medium"
            >
              Analyze
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('results')}
              className="px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-white transition-all rounded-full hover:bg-indigo-100/60 dark:hover:bg-purple-500/20 font-medium"
            >
              Results
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-800/40 dark:bg-slate-200/40 border border-slate-500/20 dark:border-purple-400/20 hover:bg-slate-800/60 dark:hover:bg-slate-200/60 transition-all"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-1.414-1.414a1 1 0 00-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414zM2.05 6.464L3.464 5.05a1 1 0 011.414 1.414L3.464 7.878a1 1 0 01-1.414-1.414zM5.064 5.064a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onScrollTo('upload')}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white text-sm font-bold shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </nav>
      <div className="sm:hidden max-w-6xl mx-auto mt-3 flex justify-center">
        <div className="glass-panel flex items-center gap-1 rounded-full px-2 py-1">
          {['hero', 'upload', 'results'].map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => onScrollTo(id)}
              className="px-3 py-1.5 text-xs text-slate-700 dark:text-slate-100 rounded-full hover:bg-purple-500/20 dark:hover:bg-purple-500/20 transition-all font-medium"
            >
              {['Home', 'Analyze', 'Results'][i]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
