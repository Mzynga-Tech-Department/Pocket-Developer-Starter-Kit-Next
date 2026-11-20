// components/ThemeToggle.jsx
'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  const cycle = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const icon = !mounted
    ? '💻'
    : theme === 'light'
      ? '☀️'
      : theme === 'dark'
        ? '🌙'
        : '💻';

  return (
    <button
      onClick={cycle}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      <span aria-hidden>{icon}</span>
      <span className="capitalize">{mounted ? theme : 'system'}</span>
    </button>
  );
}