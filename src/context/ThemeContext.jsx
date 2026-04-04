/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

// Initialize theme immediately on script load
function initializeTheme() {
  try {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(savedTheme);
    return savedTheme;
  } catch {
    return 'dark';
  }
}

// Apply theme before first render
const initialTheme = initializeTheme();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  // Sync theme changes to DOM
  useEffect(() => {
    try {
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(theme);
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Theme update error:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
