# 📘 Pocket Network Sepolia Starter Kit

A minimal, beginner-friendly **Next.js starter kit** that reads on-chain data from **Ethereum Sepolia** using **Pocket Network's free public RPC endpoint**. It displays:

- 💰 The **ETH balance** of any Sepolia address (with optional USD conversion)
- 🔢 The **nonce** (number of outgoing transactions) of any address
- ⛽ The **current network gas fees** on Sepolia (chain-wide, not address-specific)
- 🌙 **Dark mode** with a system-aware theme toggle

This kit is written in **plain JavaScript**, follows Next.js App Router conventions, and is safe to deploy as-is.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Standards & Best Practices](#-standards--best-practices)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Address Lookup** | Enter any Sepolia address to fetch its balance and nonce |
| 💵 **USD Conversion** | Balance is also shown in USD via the CoinGecko public API |
| ⛽ **Live Gas Fees** | Displays the current `maxFeePerGas` and `maxPriorityFeePerGas` in Gwei |
| 🔁 **Refresh** | Manually re-fetch account and gas data with a single click |
| 🌙 **Dark Mode** | Light / Dark / System toggle with `localStorage` persistence and no flash of unstyled content (FOUC) |
| 🔒 **Server-Side RPC** | The Pocket RPC URL is never exposed to the browser |
| ♻️ **Reusable Components** | Every UI block is isolated and can be dropped into other projects |
| 🧪 **Beginner-Friendly** | Plain JavaScript, no TypeScript, clear comments, minimal dependencies |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16+](https://nextjs.org/) (App Router) |
| Language | **JavaScript** (`.js` / `.jsx`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) with custom dark variant |
| Ethereum Client | [viem](https://viem.sh/) — modern, TypeScript-first Ethereum library |
| Chain | Ethereum **Sepolia** testnet |
| RPC Provider | [Pocket Network Public RPC](https://pocket.network/support-public-rpc/) |
| Price API | [CoinGecko](https://www.coingecko.com/en/api) (free tier) |

---

## 📂 Folder Structure

```text
pokt-starter-kit/
├── app/
│   ├── api/
│   │   └── account/
│   │       └── route.js          # Server-side RPC handler (POST /api/account)
│   ├── layout.jsx                # Root layout + metadata + theme script
│   ├── page.jsx                  # Main UI
│   └── globals.css               # Tailwind import + dark variant
├── components/
│   ├── AccountInfo.jsx           # Balance & nonce display
│   ├── AddressInput.jsx          # Address input form
│   ├── GasFeeCard.jsx            # Network gas fee display
│   ├── RefreshButton.jsx         # Refresh control
│   ├── ThemeProvider.jsx         # Theme context (light/dark/system)
│   └── ThemeToggle.jsx           # Theme switcher button
├── lib/
│   ├── viemClient.js             # Shared viem public client
│   └── utils.js                  # Formatting + price helpers
├── public/                       # Static assets
├── .env.local                    # Environment variables (not committed)
├── jsconfig.json                 # `@/` path alias for JavaScript
├── next.config.js                # CommonJS Next.js config
├── postcss.config.mjs            # Tailwind v4 PostCSS plugin
├── package.json
└── README.md
```
## ✅ Prerequisites

- **Node.js** 22.13.0 or later
- **npm** 10+ (or pnpm / yarn)
- A terminal and a browser

> **Node version note:** Some ESLint transitive dependencies now require Node `^20.19.0 || ^22.13.0 || >=24`. If you see an `EBADENGINE` warning, upgrade Node using `nvm install --lts` and `nvm use --lts`.

---

## 🚀 Getting Started

### 1. Clone or create the project

If you have this repo locally:

```bash
git clone https://github.com/Mzynga-Tech-Department/Pocket-Developer-Starter-Kit-Next.git
cd Pocket-Developer-Starter-Kit-Next
```

If you want to start fresh :-

```bash
npx create-next-app@latest pokt-starter-kit --js --app --no-src-dir
cd pokt-starter-kit
```
### 2. Install dependencies

```bash
npm install
```

> **Important:** If you edit `package.json` manually, always run `npm install` afterward. Editing the file alone does not install anything.

### 3. Configure the Environment

```bash
NEXT_PUBLIC_POKT_SEPOLIA_RPC=https://eth-sepolia-testnet.api.pocket.network
```
We are using free public rpc from Pocket network 

> https://pocket.network/support-public-rpc/

### 4. Run the development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser. You should see:

- An address input field (pre-filled with a sample address)

 - A Refresh button

- A Theme toggle (💻 System / ☀️ Light / 🌙 Dark)

- An Account Details card showing balance (ETH + USD) and nonce

- A Gas Fees card showing the current Sepolia network fees in Gwei

### 5. Build for production (Optional)

``` bash
npm run build
npm start
```
### 🔐 Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_POKT_SEPOLIA_RPC` | ✅ Yes | Pocket Network public RPC URL for Ethereum Sepolia |

> **Why the `NEXT_PUBLIC_` prefix?**

> The variable is read by the server **and** is safe to expose (it's a public, unauthenticated endpoint). 
> If you later switch to a **private RPC URL**, move the client instantiation fully server-side and drop the prefix.

> **Never commit** `.env.local`. It's already in `.gitignore` by default in Next.js projects.

## 🧠 How It Works

The data flow is intentionally simple and secure:

```text
[                 ]        [                          ]        [                      ]
|   Browser UI    | ---->  |  /api/account (POST)     | ---->  |   Pocket Sepolia     |
|   (React)       | <----  |  Next.js Route           | <----  |   Public RPC         |
[                 ]        [                          ]        [                      ]
        |
        |
        └──────────────> CoinGecko (USD price, browser-side, read-only)
```

## **Step-by-step**

1. **User submits an address** in `AddressInput.jsx`.
2. `AccountInfo.jsx` sends a `POST` request to `/api/account` with the address.
3. The **API route** (`app/api/account/route.js`):
    - Validates the address with a regex.
    - Calls `publicClient.getBalance()` and `publicClient.getTransactionCount()` in parallel via `viem`.
    - Returns `{ balanceWei, nonce }` as JSON (BigInt serialized to string).
4. The component:
    - Converts `balanceWei` to ETH using `formatEther`.
5. `GasFeeCard.jsx` independently calls `publicClient.estimateFeesPerGas()` to fetch chain-wide fees and displays them in Gwei.

## 📝 Standards & Best Practices

This kit follows these conventions:

- ✅ **Next.js App Router** with server components by default and `'use client'` only where necessary
- ✅ **Reusable, single-responsibility components** — each card is independent and portable
- ✅ **Server-side RPC calls** via API routes — no API keys or RPC URLs leak to the client
- ✅ **Environment variables** stored in `.env.local` with the `NEXT_PUBLIC_` prefix only when intentional
- ✅ **Input validation** — addresses are checked with a strict regex before hitting the RPC
- ✅ **Graceful error handling** — user-friendly error messages and loading states for blockchain...
- ✅ BigInt-safe serialization — wei values are converted to strings before JSON encoding

- ✅ Modern Ethereum tooling — viem for all chain interactions

- ✅ Pocket Network free tier respected — 2,000 req/IP/min, more than enough for this UI

- ✅ No TypeScript required — beginner-friendly plain JavaScript

- ✅ Accessible dark mode — aria-label on the toggle, aria-hidden on the icon, suppressHydrationWarning on <html>

- ✅ No flash of unstyled content (FOUC) — inline script applies the theme before React hydrates

- ✅ Hydration-safe theme state — mounted flag prevents server/client mismatches in the toggle

### 📜 License

MIT License — free to use, fork, and adapt for your own projects.

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

## 🙏 Acknowledgements

- [Pocket Network](https://www.pokt.network/) — for the free, decentralized public RPC
- [viem](https://viem.sh/) — for a delightful Ethereum client
- [Next.js](https://nextjs.org/) — for the App Router
- [Tailwind CSS](https://tailwindcss.com/) — for utility-first styling with first-class dark mode
- [CoinGecko](https://www.coingecko.com/) — for the free ETH price API
