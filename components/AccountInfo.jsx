'use client';
import { useEffect, useState } from 'react';
import { toEth, fetchEthPriceUsd } from '@/lib/utils';

export default function AccountInfo({ address, refreshKey }) {
  const [balanceEth, setBalanceEth] = useState(null);
  const [balanceUsd, setBalanceUsd] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });

        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        const ethValue = toEth(BigInt(data.balanceWei));
        setBalanceEth(ethValue);
        setNonce(data.nonce);

        const price = await fetchEthPriceUsd();
        if (price > 0) {
          setBalanceUsd((parseFloat(ethValue) * price).toFixed(2));
        }
      } catch (err) {
        setError('Could not load account data. Check the address and try again.');
      } finally {
        setLoading(false);
      }
    }

    if (address) fetchData();
  }, [address, refreshKey]);

  if (loading) {
    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Fetching account data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Account Details
      </h2>

      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
          <dd className="break-all font-mono text-sm text-gray-900 dark:text-gray-100">
            {address}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</dt>
          <dd className="text-gray-900 dark:text-gray-100">
            <span className="font-semibold">{balanceEth} ETH</span>
            {balanceUsd && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                (~${balanceUsd} USD)
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Nonce (txs sent)
          </dt>
          <dd className="font-mono text-gray-900 dark:text-gray-100">{nonce}</dd>
        </div>
      </dl>
    </div>
  );
}