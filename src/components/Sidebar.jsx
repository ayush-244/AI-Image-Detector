import React from 'react';
import {
  Squares2X2Icon,
  ClockIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { id: 'history', label: 'History', icon: ClockIcon },
  { id: 'model', label: 'Model Info', icon: CpuChipIcon },
];

export default function Sidebar({ active = 'dashboard', isOpen, onClose, onNavigate }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#020617]/80 border-r border-white/5 backdrop-blur-lg">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="h-9 w-9 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-400">AI</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold">AI Image Detector</p>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? 'bg-blue-500/10 text-white border border-blue-500/60 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
        <aside className="relative w-64 h-full bg-[#020617] border-r border-white/5 shadow-xl flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-white/5">
            <div className="h-9 w-9 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-400">AI</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold">AI Image Detector</p>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate(item.id);
                    onClose && onClose();
                  }}
                  className={`w-full flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? 'bg-blue-500/10 text-white border border-blue-500/60 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}

