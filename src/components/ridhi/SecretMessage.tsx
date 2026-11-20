import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { verifySecretMessage } from "@/lib/secret-message.functions";

/** Discreet icon (tooltip "Secret Message") → small password dialog, checked on the server. */
export function SecretMessage({ onUnlock }: { onUnlock: () => void }) {
  const verify = useServerFn(verifySecretMessage);
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong" | "error">("idle");
  const tipTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(tipTimer.current), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "checking") return;
    setState("checking");
    try {
      const r = await verify({ data: { code } });
      if (r.ok) { setOpen(false); setCode(""); setState("idle"); onUnlock(); } else setState("wrong");
    } catch { setState("error"); }
  };

  return (
    <>
      <span className="group relative inline-flex">
        <button type="button" aria-label="Secret Message" onClick={() => { setOpen(true); setState("idle"); }}
          onPointerDown={(e) => { if (e.pointerType === "touch") { setTip(true); clearTimeout(tipTimer.current); tipTimer.current = setTimeout(() => setTip(false), 1600); } }}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95">
          <Lock className="h-4 w-4" aria-hidden />
        </button>
        <span role="tooltip" className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-heading px-3 py-1 text-xs text-primary-foreground shadow-soft transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${tip ? "opacity-100" : "opacity-0"}`}>
          Secret Message
        </span>
      </span>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Secret Message" className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-heading/30 px-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="animate-zoom-in relative w-full max-w-xs space-y-5 rounded-[1.5rem] bg-card p-7 text-center shadow-photo">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-3 text-2xl text-muted-foreground hover:text-heading">×</button>
            <Lock className="mx-auto h-5 w-5 text-rose" aria-hidden />
            <label htmlFor="secret-code" className="block font-serif text-2xl text-heading">Secret Message</label>
            <input id="secret-code" inputMode="numeric" autoComplete="off" maxLength={16} value={code} autoFocus
              onChange={(e) => { setCode(e.target.value); if (state !== "checking") setState("idle"); }}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-center text-xl tracking-[0.3em] outline-none focus:ring-2 focus:ring-ring" />
            {state === "wrong" && <p role="alert" className="text-sm text-rose">Hmm, that's not it. Try again ♡</p>}
            {state === "error" && <p role="alert" className="text-sm text-rose">Couldn't check right now. Please try again.</p>}
            <button type="submit" className="btn-soft w-full" disabled={!code.trim() || state === "checking"}>{state === "checking" ? "Checking…" : "Unlock"}</button>
          </form>
        </div>
      )}
    </>
  );
}
