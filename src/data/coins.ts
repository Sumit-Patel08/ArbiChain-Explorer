/** Coin config for the Live Prices page. Add a coin here to add its card. */
export interface Coin {
  id: string; // CoinGecko id
  name: string;
  symbol: string;
  emoji: string;
  brandColor: string; // small accent dot
}

export const COINS: Coin[] = [
  { id: "bitcoin",       name: "Bitcoin",  symbol: "BTC",   emoji: "₿", brandColor: "#F7931A" },
  { id: "ethereum",      name: "Ethereum", symbol: "ETH",   emoji: "Ξ", brandColor: "#627EEA" },
  { id: "solana",        name: "Solana",   symbol: "SOL",   emoji: "◎", brandColor: "#14F195" },
  { id: "arbitrum",      name: "Arbitrum", symbol: "ARB",   emoji: "⬡", brandColor: "#28A0F0" },
  { id: "matic-network", name: "Polygon",  symbol: "MATIC", emoji: "⬢", brandColor: "#8B5CF6" },
];

export const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=" +
  COINS.map((c) => c.id).join(",") +
  "&vs_currencies=usd&include_24hr_change=true";
