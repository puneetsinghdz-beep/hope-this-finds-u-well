import { useState } from "react";
import { validateAudioFile, validateAudioUrl, type AudioChoice } from "@/lib/playlist-admin";

type Values = { title: string; artist: string; audio: AudioChoice };

export function TrackForm({ initial, hasAudio, submitLabel, onSubmit, onCancel }: {
  initial?: { title: string; artist: string }; hasAudio?: boolean; submitLabel: string;
  onSubmit: (v: Values) => Promise<void>; onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [mode, setMode] = useState<"keep" | "file" | "url" | "none">(initial ? "keep" : "file");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!title.trim()) { setErr("Please add a song title."); return; }
    let audio: AudioChoice = { kind: "keep" };
    if (mode === "file") {
      if (!file) { if (initial) audio = { kind: "keep" }; else audio = { kind: "none" }; }
      else { const v = validateAudioFile(file); if (v) { setErr(v); return; } audio = { kind: "file", file }; }
    } else if (mode === "url") {
      const v = validateAudioUrl(url); if (v) { setErr(v); return; }
      audio = url.trim() ? { kind: "url", url } : { kind: "none" };
    } else if (mode === "none") audio = { kind: "none" };
    setErr(null); setBusy(true);
    try { await onSubmit({ title, artist, audio }); if (!initial) { setTitle(""); setArtist(""); setFile(null); setUrl(""); } }
    catch (e2) { setErr((e2 as Error).message); }
    finally { setBusy(false); }
  };

  const field = "w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring";
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">Title<input className={field} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required /></label>
        <label className="space-y-1 text-sm">Artist<input className={field} value={artist} onChange={(e) => setArtist(e.target.value)} maxLength={200} /></label>
      </div>
      <fieldset className="space-y-2 text-sm">
        <legend className="mb-1">Audio</legend>
        <div className="flex flex-wrap gap-3">
          {initial && <label className="flex items-center gap-1"><input type="radio" checked={mode === "keep"} onChange={() => setMode("keep")} /> Keep current{hasAudio ? "" : " (none)"}</label>}
          <label className="flex items-center gap-1"><input type="radio" checked={mode === "file"} onChange={() => setMode("file")} /> Upload a file</label>
          <label className="flex items-center gap-1"><input type="radio" checked={mode === "url"} onChange={() => setMode("url")} /> Audio link</label>
          {initial && hasAudio && <label className="flex items-center gap-1"><input type="radio" checked={mode === "none"} onChange={() => setMode("none")} /> Remove audio</label>}
        </div>
        {mode === "file" && <input type="file" accept="audio/*,.mp3,.m4a,.aac,.ogg,.wav,.webm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />}
        {mode === "url" && <input className={field} type="url" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />}
        {!initial && mode === "file" && !file && <p className="text-xs text-muted-foreground">No file? The song will show as "Coming soon" until audio is added.</p>}
      </fieldset>
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-soft py-2" disabled={busy}>{busy ? "Saving…" : submitLabel}</button>
        {onCancel && <button type="button" className="btn-ghost py-2" onClick={onCancel} disabled={busy}>Cancel</button>}
      </div>
    </form>
  );
}
