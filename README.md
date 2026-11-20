📘 README — Pocket Network Sepolia Starter Kit
A minimal, beginner-friendly Next.js starter kit that reads on-chain data from Ethereum Sepolia using Pocket Network's free public RPC endpoint. It displays:

💰 The ETH balance of any Sepolia address (with optional USD conversion)

🔢 The nonce (number of outgoing transactions) of any address

⛽ The current network gas fees on Sepolia (chain-wide, not address-specific)

This kit is written in plain JavaScript, follows Next.js App Router conventions, and is safe to deploy as-is.

📑 Table of Contents
Features

Tech Stack

Folder Structure

Prerequisites

Getting Started

Environment Variables

How It Works

API Reference

Customization

CommonJS vs ESM

Troubleshooting

Standards & Best Practices

License

✨ Features
Feature	Description
🔍 Address Lookup	Enter any Sepolia address to fetch its balance and nonce
💵 USD Conversion	Balance is also shown in USD via the CoinGecko public API
⛽ Live Gas Fees	Displays the current maxFeePerGas and maxPriorityFeePerGas in Gwei
🔁 Refresh	Manually re-fetch account and gas data with a single click
🔒 Server-Side RPC	The Pocket RPC URL is never exposed to the browser
♻️ Reusable Components	Every UI block is isolated and can be dropped into other projects
🧪 Beginner-Friendly	Plain JavaScript, no TypeScript, clear comments, minimal dependencies
🛠 Tech Stack
Layer	Technology
Framework	Next.js 14+ (App Router)
Language	JavaScript (.js / .jsx)
Ethereum Client	viem — modern, TypeScript-first Ethereum library
Chain	Ethereum Sepolia testnet
RPC Provider	Pocket Network Public RPC https://pocket.network/support-public-rpc/
Price API	CoinGecko (free tier)
Why viem? It's lightweight, tree-shakeable, and the de-facto standard for modern Ethereum frontends. It's also the foundation of Wagmi, so this kit upgrades naturally if you later add wallet connections.

📂 Folder Structure
text
pokt-starter-kit/
├── app/
│   ├── api/
│   │   └── account/
│   │       └── route.js          # Server-side RPC handler (POST /api/account)
│   ├── layout.jsx                # Root layout + metadata
│   ├── page.jsx                  # Main UI
│   └── globals.css               # Global styles
├── components/
│   ├── AccountInfo.jsx           # Balance & nonce display
│   ├── AddressInput.jsx          # Address input form
│   ├── GasFeeCard.jsx            # Network gas fee display
│   └── RefreshButton.jsx         # Refresh control
├── lib/
│   ├── viemClient.js             # Shared viem public client
│   └── utils.js                  # Formatting + price helpers
├── public/                       # Static assets
├── .env.local                    # Environment variables (not committed)
├── jsconfig.json                 # `@/` path alias for JavaScript
├── next.config.js                # CommonJS Next.js config
├── package.json
└── README.md
✅ Prerequisites
Node.js 18.17 or later

npm 9+ (or pnpm / yarn)

A terminal and a browser

🚀 Getting Started
1. Clone or create the project
If you have this repo locally:

bash
git clone <repo-url> pokt-starter-kit
cd pokt-starter-kit
If you want to start fresh:

bash
npx create-next-app@latest pokt-starter-kit --js --app --no-src-dir --no-tailwind
cd pokt-starter-kit
2. Install dependencies
bash
npm install
npm install viem
3. Configure the environment
Create a file named .env.local at the project root:

env
NEXT_PUBLIC_POKT_SEPOLIA_RPC=https://eth-sepolia-testnet.api.pocket.network
4. Run the development server
bash
npm run dev
Open http://localhost:3000 in your browser. You should see:

An address input field (pre-filled with a sample address)

A Refresh button

An Account Details card showing balance (ETH + USD) and nonce

A Gas Fees card showing the current Sepolia network fees in Gwei

5. Build for production (optional)
bash
npm run build
npm start
🔐 Environment Variables
Variable	Required	Description
NEXT_PUBLIC_POKT_SEPOLIA_RPC	✅ Yes	Pocket Network public RPC URL for Ethereum Sepolia
Why the NEXT_PUBLIC_ prefix?
The variable is read by the server and is safe to expose (it's a public, unauthenticated endpoint). If you later switch to a private RPC URL, move the client instantiation fully server-side and drop the prefix.

Never commit .env.local. It's already in .gitignore by default in Next.js projects.

🧠 How It Works
The data flow is intentionally simple and secure:

text
┌──────────────┐      ┌──────────────────────┐      ┌────────────────────┐
│  Browser UI  │─────▶│  /api/account (POST) │─────▶│  Pocket Sepolia    │
│  (React)     │◀─────│  Next.js Route       │◀─────│  Public RPC        │
└──────────────┘      └──────────────────────┘      └────────────────────┘
        │
        └────────────▶ CoinGecko (USD price, browser-side, read-only)
Step-by-step
User submits an address in AddressInput.jsx.

AccountInfo.jsx sends a POST request to /api/account with the address.

The API route (app/api/account/route.js):

Validates the address with a regex.

Calls publicClient.getBalance() and publicClient.getTransactionCount() in parallel via viem.

Returns { balanceWei, nonce } as JSON (BigInt serialized to string).

The component:

Converts balanceWei to ETH using formatEther.

Fetches the current ETH price in USD from CoinGecko.

Renders the ETH balance, USD equivalent, and nonce.

GasFeeCard.jsx independently calls publicClient.estimateFeesPerGas() to fetch chain-wide fees and displays them in Gwei.

Why fees are chain-wide, not per-address
Gas fees on Ethereum are a property of the network, not of a specific sender. estimateFeesPerGas() returns:

maxFeePerGas — the maximum you're willing to pay per unit of gas (includes base fee + priority fee).

maxPriorityFeePerGas — the tip to the validator.

These values apply to any transaction on Sepolia at that moment.

📡 API Reference
POST /api/account
Fetches the ETH balance and transaction nonce for a Sepolia address.

Request body

json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
}
Response — 200 OK

json
{
  "balanceWei": "1234567890000000000",
  "nonce": 42
}
Field	Type	Description
balanceWei	string	Balance in wei (as a string because BigInt can't be JSON-serialized)
nonce	number	Number of transactions sent from the address
Response — 400 Bad Request

json
{ "error": "Invalid address" }
Response — 500 Internal Server Error

json
{ "error": "Failed to fetch data" }
🎨 Customization
Change the default address
Edit the initial state in app/page.jsx:

js
const [address, setAddress] = useState('0xYourAddressHere');
Change the network
Edit lib/viemClient.js and the env file:

js
// lib/viemClient.js
import { mainnet } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_POKT_MAINNET_RPC),
});
env
# .env.local
NEXT_PUBLIC_POKT_MAINNET_RPC=https://eth-mainnet.api.pocket.network
Replace with the correct Pocket endpoint for your target chain (see the Pocket RPC docs).
For a pro version see https://console.api.pocket.network/
Add a USD price fallback
CoinGecko's free tier is rate-limited. To make USD conversion more robust, edit lib/utils.js and plug in another provider (e.g., Chainlink price feed via publicClient.readContract).

Style it your way
All styles are inline for simplicity. To use Tailwind CSS or CSS Modules:

bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
Then import globals.css with Tailwind directives and swap style={{}} for className="".

Add wallet connection (advanced)
Install Wagmi and reuse the same viem setup:

bash
npm install wagmi
Wrap app/layout.jsx with WagmiProvider, then use useAccount() hooks. The publicClient in lib/viemClient.js can be swapped for Wagmi's getPublicClient().

⚠️ CommonJS vs ESM in Next.js
This starter kit uses ES Modules (import / export) for all React and route files, and CommonJS only in next.config.js. This is not a stylistic choice — it's how Next.js works:

📏 Standards & Best Practices
This kit follows these conventions:

✅ Next.js App Router with server components by default and 'use client' only where necessary

✅ Reusable, single-responsibility components — each card is independent and portable

✅ Server-side RPC calls via API routes — no API keys or RPC URLs leak to the client

✅ Environment variables stored in .env.local with the NEXT_PUBLIC_ prefix only when intentional

✅ Input validation — addresses are checked with a strict regex before hitting the RPC

✅ Graceful error handling — user-facing error messages and console.error for debugging

✅ BigInt-safe serialization — wei values are converted to strings before JSON encoding

✅ Modern Ethereum tooling — viem for all chain interactions

✅ Pocket Network free tier respected — 2,000 req/IP/min, more than enough for this UI

✅ No TypeScript required — beginner-friendly plain JavaScript

📜 License
MIT License — free to use, fork, and adapt for your own projects.

text
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

🙏 Acknowledgements

Pocket Network — for the free, decentralized public RPC https://pocket.network/

viem — for a delightful Ethereum client https://viem.sh/

Next.js — for the App Router https://nextjs.org/

CoinGecko — for the free ETH price API https://www.coingecko.com/

