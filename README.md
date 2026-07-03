# ArbiChain — Scaling Ethereum with Arbitrum

An educational 4-page website about Arbitrum and Layer 2 blockchain scaling. Interactive concepts, live crypto prices, and a working proof-of-work block simulator running entirely in the browser.

## Pages

1. **Home (`/`)** — Hero, a "How Arbitrum works" explainer, feature cards, glossary and FAQ.
2. **Concepts (`/concepts`)** — Side-by-side comparison cards (Web2 vs Web3, Ethereum vs Bitcoin, Public vs Private Key, Blockchain vs Traditional DB) with a glowing VS badge and plain-English takeaways.
3. **Live Prices (`/prices`)** — Live USD prices and 24h changes for BTC, ETH, SOL, ARB and MATIC via the CoinGecko API. Auto-refreshes every 60 seconds, with a 5-second rate-limit cooldown on the manual refresh button.
4. **Block Simulator (`/simulator`)** — A two-block chain that mines real SHA-256 proof-of-work in the browser (difficulty `"00"`). Tamper with Block 1 and both blocks turn red — the classic immutability cascade.

## Local setup

```bash
npm install
npm run dev
```

Then open the URL shown in your terminal.

## Tech stack

- **React 19** + **TanStack Start / Router** (file-based routing)
- **Tailwind CSS v4** with a custom design-token system (blueprint palette, glassmorphism, gradient accent)
- **Space Grotesk** + **Inter** + **JetBrains Mono** typography
- **CoinGecko API** for live prices
- **Web Crypto API** (`crypto.subtle.digest`) for real SHA-256 hashing in the simulator

## Code organization

```
src/
  routes/            # File-based pages (index, concepts, prices, simulator)
  components/        # Shared Navbar, Footer, Card
  hooks/
    useCryptoPrices.ts   # Data hook: loading / error / cooldown / auto-refresh
  utils/
    crypto.ts            # SHA-256 helpers + chain validation
  data/
    coins.ts             # Coin config (add a coin → one line)
  styles.css         # Design tokens, glass/gradient utilities, animations
```

## Design notes

- **Blueprint palette**: `--bg #0A0C10`, `--surface #12161F`, `--arb-blue #28A0F0`, `--arb-purple #8B5CF6`.
- **Signature gradient** (`linear-gradient(135deg, #28A0F0, #8B5CF6)`) is used sparingly — logo, one hero word, primary CTAs only.
- **Blueprint grid** background on body (40px, 2% opacity) reinforces the blockchain-structure theme.
- Respects `prefers-reduced-motion`, keyboard-navigable, visible focus rings on all interactive elements.

## Known issues / future improvements

- CoinGecko's free tier can rate-limit under heavy use; the client throttles manual refreshes but a server cache would be more robust.
- Simulator difficulty is fixed at prefix `"00"`. An adjustable difficulty slider would make the PoW cost visible.
- Chain length is fixed at two blocks for clarity — a "+ Add block" button could extend the cascade demo.
- Prices are not persisted; a small Supabase-backed `price_history` table would enable a real sparkline.
