import { useEffect, useState } from "react";
import { sendPrivateMessage, validateMessage } from "@/lib/messages";

const SAVED = "ridhi-notes-v1";
const DRAFT = "ridhi-notes-draft-v1";
type NotesData = { suggestion: string; message: string };

function read(store: Storage, key: string): NotesData | null {
  try { const v = JSON.parse(store.getItem(key) || "null"); return v && typeof v === "object" ? { suggestion: String(v.suggestion ?? ""), message: String(v.message ?? "") } : null; } catch { return null; }
}

/** Song suggestion stays on this device. The message is saved privately in the backend for Puneet only. */
export function Notes({ divider = true }: { divider?: boolean }) {
  const [data, setData] = useState<NotesData>({ suggestion: "", message: "" });
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const [sent, setSent] = useState<"idle" | "sending" | "sent" | "error" | "invalid">("idle");
  const [invalid, setInvalid] = useState("");
  useEffect(() => { const d = read(sessionStorage, DRAFT) ?? read(localStorage, SAVED); if (d) setData(d); }, []);
  const update = (p: Partial<NotesData>) => {
    const next = { ...data, ...p };
    setData(next);
    if ("suggestion" in p) setSaved("idle");
    if ("message" in p && sent !== "sending") setSent("idle");
    try { sessionStorage.setItem(DRAFT, JSON.stringify(next)); } catch { /* ignore */ }
  };
  const save = () => {
    try {
      const prev = read(localStorage, SAVED);
      localStorage.setItem(SAVED, JSON.stringify({ suggestion: data.suggestion, message: prev?.message ?? "" }));
      setSaved(read(localStorage, SAVED)?.suggestion === data.suggestion ? "saved" : "error");
    } catch { setSaved("error"); }
  };
  const send = async () => {
    if (sent === "sending") return;
    const bad = validateMessage(data.message);
    if (bad) { setInvalid(bad); setSent("invalid"); return; }
    setSent("sending");
    try {
      await sendPrivateMessage(data.message);
      update({ message: "" });
      setSent("sent");
    } catch { setSent("error"); } // the text stays in the box so nothing is lost
  };
  const field = "w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className={`space-y-6 text-left ${divider ? "mt-8 border-t border-border pt-6" : ""}`}>
      <div className="space-y-3">
        <label className="block space-y-2">
          <span className="font-serif text-xl text-heading">Any recommendation?</span>
          <input value={data.suggestion} onChange={(e) => update({ suggestion: e.target.value })} placeholder="Song name or link… 🎶" className={field} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-ghost" onClick={save}>Save</button>
          {saved === "saved" && <p role="status" className="text-sm text-muted-foreground">Saved on this device only — it hasn't been sent to Puneet.</p>}
          {saved === "error" && <p role="status" className="text-sm text-rose">Couldn't save on this device.</p>}
        </div>
      </div>
      <div className="space-y-3">
        <label className="block space-y-2">
          <span className="font-serif text-xl text-heading">Any message for me? 💌</span>
          <textarea value={data.message} onChange={(e) => update({ message: e.target.value })} placeholder="Leave me a little message… ♡" rows={3} maxLength={4000} className={field} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-soft" onClick={send} disabled={sent === "sending"}>{sent === "sending" ? "Sending…" : "Send ♡"}</button>
          {sent === "sent" && <p role="status" className="text-sm text-muted-foreground">Sent ♡ Only Puneet can read it.</p>}
          {sent === "error" && <p role="status" className="text-sm text-rose">Your message couldn't be sent. It's still here — please try again.</p>}
          {sent === "invalid" && <p role="status" className="text-sm text-rose">{invalid}</p>}
        </div>
      </div>
    </div>
  );
}
