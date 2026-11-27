// components/BatchDemo.jsx
'use client';

import { useState } from 'react';
import { publicClient, publicClientSingle  } from '@/lib/viemClient';

const BLOCK_COUNT = 5;

export default function BatchDemo() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

 async function runBatch() {
    setLoading(true);
    setResult(null);
    const start = performance.now();

    try {
      // 🔁 Use the NON-BATCHED client for this single call
      const latest = await publicClientSingle.getBlockNumber();

      const blockNumbers = Array.from(
        { length: BLOCK_COUNT },
        (_, i) => latest - BigInt(i),
      );

      // ✅ These parallel calls will be batched correctly
      const blocks = await Promise.all(
        blockNumbers.map((n) => publicClient.getBlock({ blockNumber: n })),
      );

      const ms = Math.round(performance.now() - start);

      setResult({
        count: blocks.length,
        ms,
        blockNumbers: blockNumbers.map((n) => n.toString()),
        gasUsed: blocks.map((b) => b.gasUsed.toString()),
        timestamps: blocks.map((b) => Number(b.timestamp)),
      });
    } catch (err) {
      console.error(err);
      setResult({ error: 'Batch call failed — check RPC endpoint.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        📦 RPC Request Batching
      </h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Fires <strong>{BLOCK_COUNT} parallel RPC calls</strong>. With{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
          batch: true
        </code>{' '}
        enabled in <code>lib/viemClient.js</code>, they travel as{' '}
        <strong>1 HTTP request</strong> instead of {BLOCK_COUNT}.
      </p>

      <button
        onClick={runBatch}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {loading ? 'Batching…' : `Fetch ${BLOCK_COUNT} blocks`}
      </button>

      {result?.error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {result.error}
        </p>
      )}

      {result && !result.error && (
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            ✅ Fetched <strong>{result.count}</strong> blocks in{' '}
            <strong>{result.ms} ms</strong> — billed as{' '}
            <strong>1 RPC request</strong>.
          </p>
          <ul className="mt-2 list-disc pl-5 font-mono text-xs text-gray-500 dark:text-gray-400">
            {result.blockNumbers.map((blockNum, i) => (
              <li key={blockNum}>
                block {blockNum} · gasUsed {result.gasUsed[i]} · ts{' '}
                {result.timestamps[i]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}