import { useEffect, useState } from "react";

const SAVED = "ridhi-notes-v1";
const DRAFT = "ridhi-notes-draft-v1";
type NotesData = { suggestion: string; message: string };

function read(store: Storage, key: string): NotesData | null {
  try { const v = JSON.parse(store.getItem(key) || "null"); return v && typeof v === "object" ? { suggestion: String(v.suggestion ?? ""), message: String(v.message ?? "") } : null; } catch { return null; }
}

/** Song suggestion + little message. Saved on this device only — nothing is sent anywhere. */
export function Notes() {
  const [data, setData] = useState<NotesData>({ suggestion: "", message: "" });
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  useEffect(() => { const d = read(sessionStorage, DRAFT) ?? read(localStorage, SAVED); if (d) setData(d); }, []);
  const update = (p: Partial<NotesData>) => {
    const next = { ...data, ...p };
    setData(next); setStatus("idle");
    try { sessionStorage.setItem(DRAFT, JSON.stringify(next)); } catch { /* ignore */ }
  };
  const save = () => {
    try {
      localStorage.setItem(SAVED, JSON.stringify(data));
      const back = read(localStorage, SAVED);
      setStatus(back && back.suggestion === data.suggestion && back.message === data.message ? "saved" : "error");
    } catch { setStatus("error"); }
  };
  const field = "w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="mt-8 space-y-6 border-t border-border pt-6 text-left">
      <label className="block space-y-2">
        <span className="font-serif text-xl text-heading">Any recommendation?</span>
        <input value={data.suggestion} onChange={(e) => update({ suggestion: e.target.value })} placeholder="Song name or link… 🎶" className={field} />
      </label>
      <label className="block space-y-2">
        <span className="font-serif text-xl text-heading">Any message for me? 💌</span>
        <textarea value={data.message} onChange={(e) => update({ message: e.target.value })} placeholder="Leave me a little message… ♡" rows={3} className={field} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-ghost" onClick={save}>Save</button>
        {status === "saved" && <p role="status" className="text-sm text-muted-foreground">Saved on this device only — it hasn't been sent to Puneet.</p>}
        {status === "error" && <p role="status" className="text-sm text-rose">Couldn't save on this device.</p>}
      </div>
    </div>
  );
}
