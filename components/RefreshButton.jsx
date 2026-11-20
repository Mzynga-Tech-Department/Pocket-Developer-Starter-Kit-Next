'use client';

export default function RefreshButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
    >
      {loading ? 'Refreshing…' : 'Refresh'}
    </button>
  );
}