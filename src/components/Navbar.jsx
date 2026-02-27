import React from 'react';

export default function Navbar({ onToggleSidebar, isDark, onToggleTheme }) {
  return (
    <header className="h-16 border-b border-white/5 bg-[#020617]/70 backdrop-blur-lg flex items-center px-4 sm:px-6 justify-between">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all duration-300"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Toggle sidebar</span>
          <span className="block w-4 space-y-1.5">
            <span className="block h-0.5 w-full bg-gray-300 rounded-full" />
            <span className="block h-0.5 w-full bg-gray-300 rounded-full" />
            <span className="block h-0.5 w-3/4 bg-gray-300 rounded-full" />
          </span>
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            AI Image Detector
          </h1>
          <p className="text-xs text-gray-500">
            SaaS dashboard for image authenticity analysis
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onToggleTheme}
          className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-200 flex items-center space-x-2 transition-all duration-300"
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
              isDark ? 'bg-slate-900 text-yellow-300' : 'bg-slate-100 text-slate-900'
            }`}
          >
            {isDark ? '☾' : '☀'}
          </span>
          <span className="hidden sm:inline">
            {isDark ? 'Dark mode' : 'Light mode'}
          </span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium">Ayush</span>
            <span className="text-[11px] text-gray-500">AI Image Detector</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-semibold shadow-md shadow-blue-500/30">
            AI
          </div>
        </div>
      </div>
    </header>
  );
}

