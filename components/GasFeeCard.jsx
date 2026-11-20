'use client';
import { useEffect, useState } from 'react';
import { publicClient } from '@/lib/viemClient';
import { toGwei } from '@/lib/utils';

export default function GasFeeCard() {
  const [maxFee, setMaxFee] = useState('—');
  const [priorityFee, setPriorityFee] = useState('—');
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } =
        await publicClient.estimateFeesPerGas();
      setMaxFee(toGwei(maxFeePerGas));
      setPriorityFee(toGwei(maxPriorityFeePerGas));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading network fees…</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        ⛽ Ethereum Network Gas (Sepolia)
      </h3>

      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Max Fee (maxFeePerGas):</span>{' '}
          <span className="font-mono text-blue-600 dark:text-blue-400">
            {maxFee} Gwei
          </span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Priority Fee (tip):</span>{' '}
          <span className="font-mono text-blue-600 dark:text-blue-400">
            {priorityFee} Gwei
          </span>
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        These are the current chain-wide gas fees and apply to any transaction
        on Sepolia — they are not tied to a specific address.
      </p>
    </div>
  );
}