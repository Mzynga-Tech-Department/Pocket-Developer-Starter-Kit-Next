// lib/viemClient.js
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

const rpc = process.env.NEXT_PUBLIC_POKT_SEPOLIA_RPC;

// Batched client — for parallel calls (Promise.all)
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpc, {
    batch: { wait: 50 },
    retryCount: 2,
    retryDelay: 500,
  }),
});

// Non-batched client — for single, standalone calls
export const publicClientSingle = createPublicClient({
  chain: sepolia,
  transport: http(rpc, {
    retryCount: 2,
    retryDelay: 500,
  }),
});