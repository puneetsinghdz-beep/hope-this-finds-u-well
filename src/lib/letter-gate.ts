// Playful gate only (not real security): we keep a SHA-256 hash, never the code itself.
const CODE_HASH = "662d5e4f1f4ff796d1a2e184b0541e3ed76652cdb09718da8ff698918a3c536b";

export async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** True only for the exact 8-digit code (surrounding/inner spaces from pasting are ignored). */
export async function checkLetterCode(input: string) {
  const cleaned = input.replace(/\s+/g, "");
  if (!/^\d{8}$/.test(cleaned)) return false;
  return (await sha256Hex(cleaned)) === CODE_HASH;
}
