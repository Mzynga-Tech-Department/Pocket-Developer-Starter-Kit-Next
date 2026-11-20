'use client';
import { useState } from 'react';
import AddressInput from '@/components/AddressInput';
import AccountInfo from '@/components/AccountInfo';
import GasFeeCard from '@/components/GasFeeCard';
import RefreshButton from '@/components/RefreshButton';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [address, setAddress] = useState(
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Pocket Network Sepolia Starter Kit
          </h1>
          <ThemeToggle />
        </header>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Read balance, nonce, and{' '}
          <strong className="font-semibold text-gray-900 dark:text-gray-100">
            current network gas fees
          </strong>{' '}
          via Pocket&apos;s free public RPC.
        </p>

        <AddressInput onSubmit={setAddress} />

        <div className="mt-4">
          <RefreshButton onClick={handleRefresh} loading={loading} />
        </div>

        <AccountInfo address={address} refreshKey={refreshKey} />
        <GasFeeCard />
      </div>
    </main>
  );
}