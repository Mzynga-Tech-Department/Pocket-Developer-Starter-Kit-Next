//Route.js

import { NextResponse } from 'next/server';
import { publicClient } from '@/lib/viemClient';

export async function POST(request) {
  try {
    const { address } = await request.json();

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }

    const [balanceWei, nonce] = await Promise.all([
      publicClient.getBalance({ address }),
      publicClient.getTransactionCount({ address }),
    ]);

    // BigInt is not JSON-serializable — convert to string
    return NextResponse.json({
      balanceWei: balanceWei.toString(),
      nonce,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}