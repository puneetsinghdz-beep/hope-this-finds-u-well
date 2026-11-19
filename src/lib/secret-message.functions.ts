import { createServerFn } from "@tanstack/react-start";

/**
 * Checks the Secret Message password on the server. Only a SHA-256 hash lives in the handler body,
 * which is stripped from the browser bundle, so the password never reaches the page.
 */
export const verifySecretMessage = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => {
    if (typeof input?.code !== "string" || input.code.length > 32) throw new Error("Invalid input");
    return { code: input.code };
  })
  .handler(async ({ data }) => {
    const HASH = "1379315a4345c07234ad0a4a391dc377e3dc792b88a342b5bed0e4feb5be5991";
    const cleaned = data.code.replace(/\s+/g, "");
    await new Promise((r) => setTimeout(r, 350)); // slows down guessing a little
    if (!/^\d{8}$/.test(cleaned)) return { ok: false as const };
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(cleaned));
    const hex = Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
    return hex === HASH ? { ok: true as const } : { ok: false as const };
  });
