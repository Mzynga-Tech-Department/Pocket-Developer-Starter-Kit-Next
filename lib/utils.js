//utils.js

import { formatEther, formatGwei } from 'viem';

export const toEth = (wei) => formatEther(wei);
export const toGwei = (wei) => formatGwei(wei);

export async function fetchEthPriceUsd() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await res.json();
    return data.ethereum.usd;
  } catch {
    return 0;
  }
}