import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, RefreshCw, Search, AlertCircle } from "lucide-react";
import { COINS, type Coin } from "../data/coins";
import {
  useCryptoPrices,
  formatUsd,
  formatChange,
  type PriceEntry,
} from "../hooks/useCryptoPrices";

export const Route = createFileRoute("/prices")({
  head: () => ({
    meta: [
      { title: "Live Prices — ArbiChain" },
      {
        name: "description",
        content: "Live USD prices for BTC, ETH, SOL, ARB, and MATIC via CoinGecko.",
      },
    ],
  }),
  component: Prices,
});

function Prices() {
  const { data, loading, error, lastUpdated, cooling, refetch } = useCryptoPrices();
  const [query, setQuery] = useState("");
  const [showCooldownHint, setShowCooldownHint] = useState(false);

  const filtered = COINS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase()),
  );

  const onRefresh = () => {
    const ok = refetch();
    if (!ok) {
      setShowCooldownHint(true);
      setTimeout(() => setShowCooldownHint(false), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#28A0F0] uppercase tracking-wider">Market</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">Live Prices</h1>
          <p className="mt-4 text-[color:var(--text-dim)]">
            Real-time USD prices and 24-hour changes for the biggest coins, pulled straight from
            the free CoinGecko API. Auto-refreshes every 60 seconds.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <button
            onClick={onRefresh}
            disabled={loading || cooling}
            className="inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 font-medium text-white disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing…" : cooling ? "Cooling down…" : "Refresh Prices"}
          </button>
          {showCooldownHint && (
            <p className="text-xs text-[#28A0F0]">Cooling down… try again in a moment.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter coins…"
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#28A0F0]/60"
          />
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground font-mono">
            Last updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {error && (
        <div className="mt-8 glass rounded-2xl p-6 flex items-start gap-3 border border-red-500/30">
          <AlertCircle className="text-red-400 shrink-0" size={20} />
          <div>
            <p className="font-medium">Couldn't load prices</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {loading && Object.keys(data).length === 0
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((c) => (
              <PriceCard key={c.id} coin={c} price={data[c.id]} />
            ))}
        {!loading && filtered.length === 0 && (
          <p className="text-muted-foreground col-span-full">No coins match "{query}".</p>
        )}
      </div>

      {/* Beginner guide */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">How to read this page</h2>
        <p className="mt-2 text-muted-foreground max-w-3xl">
          Each card is one cryptocurrency. Here's what the numbers mean.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["The big number", "The current price in US dollars for 1 coin. Refresh to pull the newest snapshot from CoinGecko."],
            ["The 24h % badge", "Green means up vs 24 hours ago, red means down. Crypto is volatile — big swings are normal."],
            ["Why prices move", "Supply and demand. News, adoption, ETF flows, and macro trends all push prices around."],
          ].map(([t, d]) => (
            <div key={t} className="glass rounded-2xl p-6 card-hover">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold">Meet the coins</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            ["Bitcoin (BTC)", "The original cryptocurrency (2009). Often called 'digital gold' — a store of value with a fixed 21M supply cap."],
            ["Ethereum (ETH)", "The largest smart-contract platform. ETH fuels apps, NFTs, and DeFi. Every L2 like Arbitrum settles back to Ethereum."],
            ["Arbitrum (ARB)", "The governance token of Arbitrum — Ethereum's biggest Layer 2. Holders vote on protocol evolution. Fees are still paid in ETH."],
            ["Solana (SOL)", "A high-speed L1 blockchain (an Ethereum competitor) with fast, cheap transactions and different design tradeoffs."],
            ["Polygon (MATIC/POL)", "Another Ethereum scaling ecosystem, popular for gaming and payments. Recently rebranded from MATIC to POL."],
          ].map(([n, d]) => (
            <div key={n} className="glass rounded-2xl p-6 card-hover">
              <h3 className="font-semibold">{n}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 glass rounded-2xl p-6 border border-[#28A0F0]/20">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertCircle size={18} className="text-[#28A0F0]" /> Not financial advice
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            This dashboard is for learning. Prices shown are informational only — always do your
            own research before buying or selling anything.
          </p>
        </div>
      </section>
    </div>
  );
}

function PriceCard({ coin, price }: { coin: Coin; price?: PriceEntry }) {
  const hasPrice = typeof price?.usd === "number";
  const change = price?.usd_24h_change ?? 0;
  const positive = change >= 0;

  // Pulse when the numeric price changes between refreshes.
  const [pulseKey, setPulseKey] = useState(0);
  const prevPrice = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (hasPrice && prevPrice.current !== undefined && prevPrice.current !== price!.usd) {
      setPulseKey((k) => k + 1);
    }
    if (hasPrice) prevPrice.current = price!.usd;
  }, [price?.usd, hasPrice]);

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl gradient-bg flex items-center justify-center text-white text-xl font-bold">
            {coin.emoji}
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0A0C10]"
              style={{ backgroundColor: coin.brandColor }}
              aria-hidden
            />
          </div>
          <div>
            <p className="font-semibold">{coin.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{coin.symbol}</p>
          </div>
        </div>
        {hasPrice && typeof price?.usd_24h_change === "number" && (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              positive
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {formatChange(change).replace(/^[+-]/, "")}
          </div>
        )}
      </div>
      <div className="mt-6 rounded-lg -mx-2 px-2 py-1">
        {hasPrice ? (
          <p
            key={pulseKey}
            className="font-mono text-3xl font-bold animate-price-pulse rounded-lg px-1"
          >
            {formatUsd(price!.usd!)}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">Data unavailable</p>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/10" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-2 w-12 bg-white/10 rounded" />
        </div>
      </div>
      <div className="mt-6 h-8 w-32 bg-white/10 rounded" />
    </div>
  );
}
