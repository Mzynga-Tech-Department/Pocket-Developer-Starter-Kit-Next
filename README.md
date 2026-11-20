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
- [API Reference](#-api-reference)
- [Customization](#-customization)
- [CommonJS vs ESM in Next.js](#-commonjs-vs-esm-in-nextjs)
- [Troubleshooting](#-troubleshooting)
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

> **Why viem?** It's lightweight, tree-shakeable, and the de-facto standard for modern Ethereum frontends. It's also the foundation of Wagmi, so this kit upgrades naturally if you later add wallet connections.

> **Why Tailwind v4?** It uses a CSS-first configuration model — no `tailwind.config.js` is needed. The dark variant is defined with `@custom-variant` in `globals.css`, giving you full control over class-based dark mode.

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