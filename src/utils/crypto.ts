/**
 * SHA-256 utilities for the ArbiChain block simulator.
 * All hashing runs client-side via the Web Crypto API.
 */

export const DIFFICULTY_PREFIX = "00";
export const GENESIS_PREV = "0000000000000000";

/** SHA-256 of `${index}${data}${previousHash}${nonce}` returned as lowercase hex. */
export async function computeHash(
  index: number,
  data: string,
  previousHash: string,
  nonce: number,
): Promise<string> {
  const input = `${index}${data}${previousHash}${nonce}`;
  const bytes = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface ChainBlock {
  index: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
}

/**
 * A block is valid iff:
 *  - its stored hash matches a fresh SHA-256 of its fields, AND
 *  - the hash starts with the difficulty prefix, AND
 *  - (for non-genesis blocks) its previousHash equals the previous block's live hash.
 *
 * Editing any block's data invalidates it and cascades to every block after it.
 */
export async function validateChain(chain: ChainBlock[]): Promise<boolean[]> {
  const results: boolean[] = [];
  let prevLiveHash: string | null = null;
  for (const b of chain) {
    const liveHash = await computeHash(b.index, b.data, b.previousHash, b.nonce);
    const hashOk = !!b.hash && b.hash === liveHash && b.hash.startsWith(DIFFICULTY_PREFIX);
    const linkOk = prevLiveHash === null || b.previousHash === prevLiveHash;
    results.push(hashOk && linkOk);
    prevLiveHash = liveHash;
  }
  return results;
}
