// components/ThemeProvider.jsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system');
  const [mounted, setMounted] = useState(false);

  // On mount, hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'system';
    setThemeState(stored);
    setMounted(true);
  }, []);

  // Apply the theme whenever it changes
  const setTheme = (next) => {
    setThemeState(next);
    localStorage.setItem('theme', next);

    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = next === 'dark' || (next === 'system' && prefersDark);
    root.classList.toggle('dark', isDark);
  };

  // When in 'system' mode, react to OS theme changes in real time
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);