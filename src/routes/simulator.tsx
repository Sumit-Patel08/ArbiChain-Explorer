import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Pickaxe, CheckCircle2, XCircle, Info } from "lucide-react";
import { computeHash, DIFFICULTY_PREFIX, GENESIS_PREV } from "../utils/crypto";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Block Simulator — ArbiChain" },
      {
        name: "description",
        content:
          "Interactive proof-of-work simulator. Mine blocks, break the chain, and see immutability in action.",
      },
    ],
  }),
  component: Simulator,
});

/** Alias so the JSX below still reads naturally. */
const sha256 = (input: string) => {
  const bytes = new TextEncoder().encode(input);
  return crypto.subtle.digest("SHA-256", bytes).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  );
};
// re-export helper so tree-shakers don't drop the import
void computeHash;

const CHAIN_LENGTH = 4;

const INITIAL_DATA = [
  "First transaction: Alice → Bob 10 ARB",
  "Second transaction: Bob → Carol 3 ARB",
  "Third transaction: Carol → Dave 5 ARB",
  "Fourth transaction: Dave → Eve 2 ARB",
];

interface BlockState {
  index: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  mining: boolean;
}

function createInitialBlocks(): BlockState[] {
  return INITIAL_DATA.map((data, i) => ({
    index: i + 1,
    data,
    previousHash: i === 0 ? GENESIS_PREV : "",
    nonce: 0,
    hash: "",
    mining: false,
  }));
}

function Simulator() {
  const [blocks, setBlocks] = useState<BlockState[]>(createInitialBlocks);
  const [liveHashes, setLiveHashes] = useState<string[]>(() =>
    Array(CHAIN_LENGTH).fill(""),
  );

  // Recompute live hashes whenever any block field that feeds the hash changes.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hashes = await Promise.all(
        blocks.map((b) =>
          sha256(`${b.index}${b.data}${b.previousHash}${b.nonce}`),
        ),
      );
      if (!cancelled) setLiveHashes(hashes);
    })();
    return () => {
      cancelled = true;
    };
  }, [blocks]);

  // Keep each block's previousHash synced to the previous block's live hash.
  // Editing block N propagates through N+1, N+2, … automatically.
  useEffect(() => {
    setBlocks((prev) => {
      let changed = false;
      const next = prev.map((b, i) => {
        if (i === 0) return b;
        const expectedPrev = liveHashes[i - 1];
        if (!expectedPrev || b.previousHash === expectedPrev) return b;
        changed = true;
        return { ...b, previousHash: expectedPrev };
      });
      return changed ? next : prev;
    });
  }, [liveHashes]);

  const isValid = (i: number) => {
    const b = blocks[i];
    const live = liveHashes[i];
    const hashOk =
      !!b.hash && b.hash === live && b.hash.startsWith(DIFFICULTY_PREFIX);
    const linkOk = i === 0 || b.previousHash === liveHashes[i - 1];
    return hashOk && linkOk;
  };

  const updateBlock = (i: number, patch: Partial<BlockState>) => {
    setBlocks((prev) =>
      prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)),
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-[#9945FF] uppercase tracking-wider">
          Interactive
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold">Block Simulator</h1>
        <p className="mt-4 text-muted-foreground">
          A four-block chain with real SHA-256 proof-of-work. Mine each block until its hash
          starts with <code className="text-[#28A0F0]">{DIFFICULTY_PREFIX}</code>, then try
          tampering with any earlier block and watch every block after it break.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {blocks.map((block, i) => (
          <BlockCard
            key={block.index}
            block={block}
            liveHash={liveHashes[i]}
            valid={isValid(i)}
            onDataChange={(v) => updateBlock(i, { data: v })}
            onMined={(nonce, hash) =>
              updateBlock(i, { nonce, hash, mining: false })
            }
            onMiningStart={() => updateBlock(i, { mining: true })}
          />
        ))}
      </div>

      <div className="mt-8 glass rounded-2xl p-5 flex items-start gap-3">
        <Info size={18} className="text-[#28A0F0] mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Mine all four blocks, then change Block 2's data while Block 1 stays valid — Blocks 2,
          3 and 4 turn red. That cascade is{" "}
          <span className="text-foreground font-medium">immutability in action</span>. Re-mine
          from the broken block onward to restore the chain.
        </p>
      </div>

      {/* How to play */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">How to play</h2>
        <p className="mt-2 text-muted-foreground max-w-3xl">
          Follow these steps to see a blockchain actually work in front of your eyes.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "1",
              "Mine all four blocks",
              "Click ⛏ Mine on Blocks 1 → 4 in order. Each block's Previous Hash automatically links to the one before it.",
            ],
            [
              "2",
              "Tamper mid-chain",
              "Edit Block 2's data. Block 1 stays green, but Blocks 2, 3 and 4 instantly turn red — the chain is broken from that point on.",
            ],
            [
              "3",
              "Try Block 1 too",
              "Reset and mine everything again, then edit Block 1. Every block after it fails. One bad link poisons the rest of history.",
            ],
            [
              "4",
              "Repair the chain",
              "Re-mine from the first broken block onward (e.g. 2, then 3, then 4). Each goes green again only when its link is honest.",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="glass rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center font-display font-bold text-white">
                {n}
              </div>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Concepts explained */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">What the fancy words mean</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            {
              t: "Hash",
              d: "A fingerprint of some data. Give SHA-256 any input and it spits out a fixed-size string. Change the input by one character and the whole fingerprint changes completely.",
            },
            {
              t: "Nonce",
              d: "A number miners keep changing until the hash of the block happens to start with a certain pattern (here: '00'). It's like rolling dice millions of times until you get the roll you want.",
            },
            {
              t: "Proof-of-work",
              d: "The 'proof' is that you actually spent CPU time guessing nonces to find a valid hash. Anyone can verify it instantly, but producing it takes real work — which makes attacks expensive.",
            },
            {
              t: "Immutability",
              d: "Because each block's hash depends on the previous block's hash, changing an old block breaks every block after it. Rewriting history means re-mining everything — practically impossible on a real network.",
            },
          ].map((x) => (
            <div key={x.t} className="glass rounded-2xl p-6">
              <h3 className="font-semibold gradient-text">{x.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real world */}
      <section className="mt-16 mb-8">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold">How this compares to real Bitcoin & Ethereum</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Real Bitcoin requires a hash starting with roughly 19 zeros instead of just 2 — that
            takes the entire global mining network about 10 minutes per block. Real Ethereum used
            to work the same way but switched to{" "}
            <span className="text-foreground font-medium">Proof-of-Stake</span> in 2022, where
            validators lock up ETH as collateral instead of burning electricity.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Arbitrum takes a totally different approach — it doesn't mine at all. It trusts a
            sequencer to order transactions and lets anyone challenge bad ones. But the core idea
            you just played with —{" "}
            <span className="text-foreground font-medium">
              linked hashes make history unforgeable
            </span>{" "}
            — is the foundation every blockchain, including Arbitrum, is built on.
          </p>
        </div>
      </section>
    </div>
  );
}

interface BlockCardProps {
  block: BlockState;
  liveHash: string;
  valid: boolean;
  onDataChange: (v: string) => void;
  onMined: (nonce: number, hash: string) => void;
  onMiningStart: () => void;
}

function BlockCard({
  block,
  liveHash,
  valid,
  onDataChange,
  onMined,
  onMiningStart,
}: BlockCardProps) {
  const [displayNonce, setDisplayNonce] = useState(block.nonce);
  const [mining, setMining] = useState(false);
  const cancelRef = useRef(false);
  const flashRef = useRef<HTMLDivElement>(null);
  const wasValidRef = useRef(valid);

  // Flash card when validity flips from valid → invalid.
  useEffect(() => {
    if (wasValidRef.current && !valid && flashRef.current) {
      flashRef.current.classList.remove("animate-shake");
      // force reflow to restart animation
      void flashRef.current.offsetWidth;
      flashRef.current.classList.add("animate-shake");
    }
    wasValidRef.current = valid;
  }, [valid]);

  useEffect(() => setDisplayNonce(block.nonce), [block.nonce]);

  /**
   * Mining loop:
   * - Increment nonce, compute SHA-256(index + data + prevHash + nonce)
   * - Stop when the hash starts with DIFFICULTY_PREFIX ("00")
   * - Yield to the UI every 250 attempts so nonce counter is visible
   */
  const mine = useCallback(async () => {
    setMining(true);
    onMiningStart();
    cancelRef.current = false;
    let nonce = 0;
    while (!cancelRef.current) {
      const hash = await sha256(
        `${block.index}${block.data}${block.previousHash}${nonce}`,
      );
      if (hash.startsWith(DIFFICULTY_PREFIX)) {
        setDisplayNonce(nonce);
        setMining(false);
        onMined(nonce, hash);
        return;
      }
      nonce++;
      if (nonce % 250 === 0) {
        setDisplayNonce(nonce);
        // yield to event loop so React can render
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    setMining(false);
  }, [block.data, block.index, block.previousHash, onMined, onMiningStart]);

  useEffect(
    () => () => {
      cancelRef.current = true;
    },
    [],
  );

  // Show invalid styling whenever a mined block no longer checks out,
  // including when an earlier block's tamper cascades into this one.
  const showInvalid = !!block.hash && !valid;

  return (
    <div
      ref={flashRef}
      className={`glass rounded-2xl p-6 transition-colors ${
        block.hash
          ? valid
            ? "border-emerald-500/30"
            : "border-red-500/50 bg-red-500/[0.04]"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center font-display font-bold text-white">
            #{block.index}
          </div>
          <h2 className="text-xl font-semibold">Block {block.index}</h2>
        </div>
        {block.hash ? (
          valid ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-400 px-3 py-1 text-xs font-medium">
              <CheckCircle2 size={14} /> Block Valid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 text-red-400 px-3 py-1 text-xs font-medium">
              <XCircle size={14} /> Block Invalid
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 text-muted-foreground px-3 py-1 text-xs font-medium">
            Not mined
          </span>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Block Data">
          <textarea
            value={block.data}
            onChange={(e) => onDataChange(e.target.value)}
            rows={2}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#28A0F0]/60 resize-none"
          />
        </Field>
        <Field label="Previous Hash">
          <code className="block w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono break-all text-muted-foreground">
            {block.previousHash || "—"}
          </code>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nonce">
            <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm font-mono">
              {mining ? displayNonce : block.nonce}
            </div>
          </Field>
          <Field label="Difficulty">
            <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm font-mono text-[#28A0F0]">
              starts with "{DIFFICULTY_PREFIX}"
            </div>
          </Field>
        </div>
        <Field label="Hash">
          <code
            className={`block w-full rounded-xl border px-3 py-2 text-xs font-mono break-all ${
              showInvalid
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-white/5 border-white/10"
            }`}
          >
            {block.hash || liveHash || "—"}
          </code>
        </Field>
      </div>

      <button
        onClick={mine}
        disabled={mining}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-bg px-5 py-3 font-medium text-white disabled:opacity-70"
      >
        <Pickaxe size={16} className={mining ? "animate-bounce" : ""} />
        {mining ? `Mining… nonce ${displayNonce}` : "Mine Block"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
