import { createFileRoute } from "@tanstack/react-router";
import { Globe, Sparkles, Bitcoin, Coins, Key, Lock, Database, Network } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Concepts — ArbiChain" },
      {
        name: "description",
        content:
          "Web2 vs Web3, Ethereum vs Bitcoin, public vs private keys, blockchain vs traditional databases — explained side by side.",
      },
    ],
  }),
  component: Concepts,
});

interface Side {
  icon: LucideIcon;
  title: string;
  color: string;
  points: string[];
}
interface Comparison {
  heading: string;
  subtitle: string;
  takeaway: string;
  left: Side;
  right: Side;
}


const comparisons: Comparison[] = [
  {
    heading: "Web2 vs Web3",
    subtitle: "How the internet is owned and controlled",
    takeaway:
      "Web2 = you rent your online life from big platforms. Web3 = you own your account, data, and money because they live on a public blockchain, not a company's server.",

    left: {
      icon: Globe,
      title: "Web2",
      color: "#64748b",
      points: [
        "Owned by large centralized companies",
        "You are the product — your data is monetized",
        "Platforms can ban, throttle, or delete accounts",
        "Value flows to the platform, not the users",
      ],
    },
    right: {
      icon: Sparkles,
      title: "Web3",
      color: "#28A0F0",
      points: [
        "Decentralized — no single company in control",
        "Users own their identity, data, and assets",
        "Permissionless access, no gatekeepers",
        "Value flows directly between participants",
      ],
    },
  },
  {
    heading: "Ethereum vs Bitcoin",
    subtitle: "Two very different visions for a blockchain",
    takeaway:
      "Bitcoin is like digital gold — a simple, hardened way to store and send value. Ethereum is like a global computer — you can build almost any app on top of it, including Arbitrum.",

    left: {
      icon: Bitcoin,
      title: "Bitcoin",
      color: "#f7931a",
      points: [
        "Designed as digital money & store of value",
        "Very limited scripting — no smart contracts",
        "Fixed 21M supply, deflationary by design",
        "Optimized for security and simplicity",
      ],
    },
    right: {
      icon: Coins,
      title: "Ethereum",
      color: "#9945FF",
      points: [
        "A programmable smart-contract platform",
        "Runs decentralized apps (DeFi, NFTs, DAOs)",
        "Turing-complete EVM developers can build on",
        "Foundation layer for L2s like Arbitrum",
      ],
    },
  },
  {
    heading: "Public Key vs Private Key",
    subtitle: "Your wallet's most important asymmetry",
    takeaway:
      "Think of your public key as your email address (share it, get money) and your private key as your password (never share it, controls the money). Lose the private key, lose the wallet.",

    left: {
      icon: Key,
      title: "Public Key",
      color: "#28A0F0",
      points: [
        "Safe to share — this is your address",
        "Used by others to send you funds",
        "Derived from your private key one-way",
        "Visible on-chain, tied to your activity",
      ],
    },
    right: {
      icon: Lock,
      title: "Private Key",
      color: "#ef4444",
      points: [
        "Secret — NEVER share with anyone",
        "Signs transactions and proves ownership",
        "Whoever has it controls all your funds",
        "Lose it and your assets are gone forever",
      ],
    },
  },
  {
    heading: "Blockchain vs Traditional Database",
    subtitle: "Trustless network vs single admin",
    takeaway:
      "A normal database has one owner who can edit or delete anything. A blockchain has thousands of copies and no single owner — the rules are enforced by math, so nobody can quietly change history.",

    left: {
      icon: Database,
      title: "Traditional DB",
      color: "#64748b",
      points: [
        "Centralized — one admin controls it",
        "Records can be edited or deleted",
        "You must trust the operator",
        "Fast and cheap, but not censorship-resistant",
      ],
    },
    right: {
      icon: Network,
      title: "Blockchain",
      color: "#9945FF",
      points: [
        "Distributed across many independent nodes",
        "Immutable — history cannot be rewritten",
        "Trustless — verified by math, not people",
        "Transparent and censorship-resistant",
      ],
    },
  },
];

function Concepts() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-[#28A0F0] uppercase tracking-wider">Concepts</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold">Core comparisons</h1>
        <p className="mt-4 text-muted-foreground">
          Four fundamental ideas in Web3, laid out side by side so the contrast is obvious.
          Read the pointers on each side, then check the plain-English takeaway underneath.
        </p>
      </div>

      {/* Beginner primer */}
      <div className="mt-8 glass rounded-2xl p-6 border border-[#9945FF]/20">
        <h2 className="font-semibold text-lg">👋 Totally new to crypto?</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Read this first. A <span className="text-foreground font-medium">blockchain</span> is
          a shared notebook that thousands of computers keep in sync. Every entry is checked by
          math and can't be erased. That "shared, unerasable notebook" is the foundation for
          everything below — Web3 apps, digital money, and wallets.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {comparisons.map((c, i) => (
          <div
            key={c.heading}
            className="glass rounded-2xl p-6 sm:p-8 animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{c.heading}</h2>
              <p className="text-sm text-muted-foreground mt-1">{c.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
              <ComparisonCol side={c.left} tone="blue" />

              <div className="flex md:flex-col items-center justify-center">
                <div className="hidden md:block w-px flex-1 bg-white/10" />
                <div className="my-3 relative">
                  <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center font-display font-bold text-white glow">
                    VS
                  </div>
                </div>
                <div className="hidden md:block w-px flex-1 bg-white/10" />
              </div>

              <ComparisonCol side={c.right} tone="purple" />
            </div>

            <div className="mt-6 rounded-xl bg-gradient-to-r from-[#28A0F0]/10 to-[#9945FF]/10 border border-white/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wider gradient-text">
                Key takeaway
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {c.takeaway}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Putting it together */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold">Putting it all together</h2>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          Web3 is the movement. A blockchain like Ethereum is the shared database that makes it
          possible. Your wallet (a public key + private key) is your identity and bank account on
          that database. Arbitrum is a faster, cheaper lane on top of Ethereum so everyday people
          can actually use it without paying huge fees.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["🌐", "Web3", "The philosophy — users own their data and money."],
            ["⛓️", "Blockchain", "The tech — a public, tamper-proof shared database."],
            ["🔑", "Wallet", "The tool — how you hold assets and sign actions."],
          ].map(([e, t, d]) => (
            <div key={t} className="glass rounded-2xl p-5">
              <div className="text-3xl">{e}</div>
              <p className="mt-3 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


function ComparisonCol({ side, tone }: { side: Side; tone: "blue" | "purple" }) {
  const Icon = side.icon;
  const tint =
    tone === "blue"
      ? "bg-[#28A0F0]/[0.04] border-[#28A0F0]/15 hover:border-[#28A0F0]/40"
      : "bg-[#8B5CF6]/[0.04] border-[#8B5CF6]/15 hover:border-[#8B5CF6]/40";
  return (
    <div className={`rounded-xl border p-5 transition-all hover:-translate-y-1 ${tint}`}>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${side.color}22`, color: side.color }}
        >
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-semibold">{side.title}</h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {side.points.map((p) => (
          <li key={p} className="flex gap-2 text-sm text-muted-foreground">
            <span style={{ color: side.color }} className="mt-1">▸</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
