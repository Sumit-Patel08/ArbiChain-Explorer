import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, ShieldCheck, Gauge, ArrowRight, Layers } from "lucide-react";
import { Card } from "../components/Card";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-[#28A0F0]/30 blur-3xl animate-blob" />
          <div
            className="absolute top-40 right-0 w-[28rem] h-[28rem] rounded-full bg-[#9945FF]/25 blur-3xl animate-blob"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-[#28A0F0]/20 blur-3xl animate-blob"
            style={{ animationDelay: "6s" }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8">
            <Layers size={14} className="text-[#28A0F0]" />
            Layer 2 · Optimistic Rollup
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Scaling Ethereum <br />
            with <span className="gradient-text">Arbitrum</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Layer 2 rollups move transactions off-chain, settle back to Ethereum, and cut fees
            dramatically — without giving up L1 security.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/concepts"
              className="inline-flex items-center gap-2 rounded-2xl gradient-bg px-6 py-3 font-medium text-white glow"
            >
              Explore Concepts <ArrowRight size={18} />
            </Link>
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium hover:bg-white/10"
            >
              Try Block Simulator
            </Link>
          </div>
        </div>
      </section>

      {/* What is Layer 2 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#28A0F0] uppercase tracking-wider">
            The Basics
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">What is Layer 2?</h2>
          <p className="mt-4 text-muted-foreground">
            Three short answers to understand why Arbitrum exists and what it actually does.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <div className="text-3xl">⛽</div>
            <h3 className="mt-4 text-xl font-semibold">Why Ethereum needed L2</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Ethereum became a victim of its own success — high gas fees, network congestion,
              and limited throughput made everyday use painful for regular users.
            </p>
          </Card>
          <Card>
            <div className="text-3xl">🧩</div>
            <h3 className="mt-4 text-xl font-semibold">What Arbitrum is</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              An Optimistic Rollup: it bundles many transactions off-chain, executes them
              cheaply, and posts the results back to Ethereum for final settlement.
            </p>
          </Card>
          <Card>
            <div className="text-3xl">🚀</div>
            <h3 className="mt-4 text-xl font-semibold">The real-world win</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Users get dramatically lower fees and faster confirmations, while still inheriting
              Ethereum's battle-tested security guarantees underneath.
            </p>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#9945FF] uppercase tracking-wider">
            Why builders choose it
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Key benefits</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Lower Gas Fees",
              desc: "Transactions cost a fraction of L1 — often cents instead of dollars.",
            },
            {
              icon: ShieldCheck,
              title: "Ethereum-Grade Security",
              desc: "Final settlement happens on Ethereum, so you inherit L1 trust guarantees.",
            },
            {
              icon: Gauge,
              title: "Faster Transactions",
              desc: "Near-instant confirmations mean smoother apps, games, and DeFi flows.",
            },
          ].map((f) => (
            <Card key={f.title}>
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Beginner: How Arbitrum actually works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#28A0F0] uppercase tracking-wider">
            Under the hood
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">How Arbitrum actually works</h2>
          <p className="mt-4 text-muted-foreground">
            An Optimistic Rollup in four simple steps — no jargon needed.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "1",
              t: "You submit a transaction",
              d: "You send a swap, mint, or transfer to Arbitrum instead of Ethereum directly. It hits Arbitrum first because fees are much lower there.",
            },
            {
              n: "2",
              t: "Arbitrum bundles it",
              d: "A special node called the Sequencer batches your transaction with thousands of others and executes them all off Ethereum's main chain.",
            },
            {
              n: "3",
              t: "The batch is posted to L1",
              d: "The compressed batch and its resulting state are posted back to Ethereum. This is what gives Arbitrum its Ethereum-level security.",
            },
            {
              n: "4",
              t: "A challenge window opens",
              d: "For a short period, anyone can dispute a bad batch with a fraud proof. If nobody challenges, the state becomes final on Ethereum.",
            },
          ].map((s) => (
            <Card key={s.n}>
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center font-display font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
          "Optimistic" means the network <em>optimistically</em> assumes transactions are valid
          and only re-checks them if someone raises a dispute. That's what makes it fast.
        </p>
      </section>

      {/* Glossary */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#9945FF] uppercase tracking-wider">
            Quick glossary
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">New here? Start with these words</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["Blockchain", "A public database, copied across thousands of computers, where every entry is permanent and verifiable."],
            ["Layer 1 (L1)", "The base blockchain itself. Ethereum and Bitcoin are Layer 1s. They're secure but can be slow and expensive."],
            ["Layer 2 (L2)", "A network built on top of a Layer 1 to make it faster and cheaper — like Arbitrum on top of Ethereum."],
            ["Gas fee", "The cost paid to run a transaction. On Ethereum L1 it can be $10+, on Arbitrum it's usually a few cents."],
            ["Wallet", "An app (like MetaMask) that holds your keys and lets you sign transactions. You are your own bank."],
            ["Smart contract", "Code that lives on the blockchain and runs automatically when called. This is what makes apps like DeFi work."],
            ["Rollup", "A scaling technique that 'rolls up' many L2 transactions into one L1 transaction. Arbitrum is a rollup."],
            ["Bridge", "A tool to move tokens between chains — for example from Ethereum to Arbitrum and back."],
          ].map(([term, def]) => (
            <div key={term} className="glass rounded-2xl p-5">
              <p className="font-semibold gradient-text">{term}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#28A0F0] uppercase tracking-wider">FAQ</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Common beginner questions</h2>
        </div>
        <div className="mt-10 space-y-4">
          {[
            {
              q: "Is my money safe on Arbitrum?",
              a: "Arbitrum inherits Ethereum's security because every state update is posted back to Ethereum. It's non-custodial too — you always control your funds through your own wallet.",
            },
            {
              q: "Do I need a new wallet for Arbitrum?",
              a: "No. Any Ethereum wallet (MetaMask, Rabby, Coinbase Wallet, etc.) works with Arbitrum — you just add the Arbitrum network to it.",
            },
            {
              q: "What token do I pay fees in?",
              a: "ETH. Even though Arbitrum has its own governance token called ARB, gas fees are paid in ETH — just much less of it than on mainnet.",
            },
            {
              q: "How is this different from Solana?",
              a: "Solana is its own separate Layer 1 with a different design (one big fast chain). Arbitrum is a Layer 2 that piggybacks on Ethereum's security. Different tradeoffs, both valid.",
            },
            {
              q: "What can I actually do on Arbitrum?",
              a: "The same things as on Ethereum — swap tokens on DEXs like Uniswap, borrow and lend on Aave, mint NFTs, play on-chain games — just cheaper and faster.",
            },
          ].map((f) => (
            <details
              key={f.q}
              className="glass rounded-2xl p-5 group"
            >
              <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                {f.q}
                <span className="gradient-text text-xl transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass rounded-3xl p-10 sm:p-14 text-center glow">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to go deeper?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Compare the fundamental ideas of Web3, or get hands-on and mine your own blocks to
            see how the chain stays honest.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/concepts"
              className="rounded-2xl gradient-bg px-6 py-3 font-medium text-white glow"
            >
              Learn the Concepts
            </Link>
            <Link
              to="/simulator"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium hover:bg-white/10"
            >
              Try the Simulator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

