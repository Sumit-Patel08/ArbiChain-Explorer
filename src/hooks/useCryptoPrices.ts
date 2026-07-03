import { useCallback, useEffect, useRef, useState } from "react";
import { COINGECKO_URL } from "../data/coins";

export interface PriceEntry {
  usd: number;
  usd_24h_change: number;
}
export type PriceMap = Record<string, PriceEntry | undefined>;

const COOLDOWN_MS = 5000;
const POLL_MS = 60000;

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const smallCurrencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export function formatUsd(n: number): string {
  return n < 1 ? smallCurrencyFmt.format(n) : currencyFmt.format(n);
}

export function formatChange(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

/**
 * Live crypto prices via CoinGecko.
 * - Handles loading / error / data explicitly (never crashes on partial responses).
 * - Rate-limit safety: refetch() disabled for 5s after each call.
 * - Auto-refreshes every 60s and cleans up on unmount.
 */
export function useCryptoPrices() {
  const [data, setData] = useState<PriceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cooling, setCooling] = useState(false);
  const coolingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(COINGECKO_URL);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const json = (await res.json()) as PriceMap;
      setData(json);
      setLastUpdated(new Date());
    } catch (e) {
      setError(
        e instanceof Error
          ? "Couldn't reach CoinGecko. Check your connection and refresh."
          : "Unknown error",
      );
    } finally {
      setLoading(false);
      setCooling(true);
      if (coolingTimer.current) clearTimeout(coolingTimer.current);
      coolingTimer.current = setTimeout(() => setCooling(false), COOLDOWN_MS);
    }
  }, []);

  const refetch = useCallback(() => {
    if (cooling) return false;
    void fetchPrices();
    return true;
  }, [cooling, fetchPrices]);

  useEffect(() => {
    void fetchPrices();
    const id = setInterval(() => void fetchPrices(), POLL_MS);
    return () => {
      clearInterval(id);
      if (coolingTimer.current) clearTimeout(coolingTimer.current);
    };
  }, [fetchPrices]);

  return { data, loading, error, lastUpdated, cooling, refetch };
}
