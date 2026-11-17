import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tracksQuery, type PlayTrack } from "@/lib/tracks";
import { addTrack, deleteTrack, swapPositions, updateTrack } from "@/lib/playlist-admin";
import { TrackForm } from "./TrackForm";

export function ManagePlaylist() {
  const qc = useQueryClient();
  const { data: tracks, isLoading, error } = useQuery(tracksQuery);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: tracksQuery.queryKey });
  const run = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true); setMsg(null);
    try { await fn(); await refresh(); setMsg({ ok: true, text: ok }); }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
    finally { setBusy(false); }
  };

  if (isLoading) return <p className="text-center text-muted-foreground">Loading the playlist…</p>;
  if (error || !tracks) return <p role="alert" className="text-center text-destructive">The playlist couldn't be loaded. Please refresh.</p>;
  const nextPos = (tracks.at(-1)?.position ?? 0) + 1;

  return (
    <div className="space-y-8">
      {msg && <p role="status" className={`rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-secondary text-heading" : "bg-accent text-destructive"}`}>{msg.text}</p>}

      <div className="rounded-[1.5rem] bg-card p-5 shadow-soft">
        <h2 className="mb-4 text-2xl">Add a song</h2>
        <TrackForm submitLabel="Add to the end" onSubmit={async (v) => {
          setMsg(null);
          try { await addTrack(v, nextPos); await refresh(); setMsg({ ok: true, text: `"${v.title.trim()}" was added.` }); }
          catch (e) { throw e; }
        }} />
      </div>

      <ol className="space-y-2">
        {tracks.map((t: PlayTrack, i) => (
          <li key={t.id} className="rounded-2xl bg-card p-4 shadow-soft">
            {editing === t.id ? (
              <TrackForm initial={{ title: t.title, artist: t.artist ?? "" }} hasAudio={!!(t.audioUrl || t.storagePath)} submitLabel="Save changes"
                onCancel={() => setEditing(null)}
                onSubmit={async (v) => { await updateTrack(t, v); await refresh(); setEditing(null); setMsg({ ok: true, text: `"${v.title.trim()}" was saved.` }); }} />
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-6 text-xs text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-heading">{t.title}{t.artist && <span className="text-muted-foreground"> — {t.artist}</span>}</p>
                  <p className="text-xs text-muted-foreground">{t.src ? "Audio ready" : "No audio yet — shows as Coming soon"}</p>
                </div>
                {confirmId === t.id ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span>Remove "{t.title}"?</span>
                    <button className="btn-ghost py-1.5 text-destructive" disabled={busy} onClick={() => run(async () => { await deleteTrack(t); setConfirmId(null); }, `"${t.title}" was removed.`)}>Yes, remove</button>
                    <button className="btn-ghost py-1.5" onClick={() => setConfirmId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button className="btn-ghost px-3 py-1.5" aria-label={`Move ${t.title} up`} disabled={busy || i === 0} onClick={() => run(() => swapPositions(t, tracks[i - 1]!), "Order saved.")}>↑</button>
                    <button className="btn-ghost px-3 py-1.5" aria-label={`Move ${t.title} down`} disabled={busy || i === tracks.length - 1} onClick={() => run(() => swapPositions(t, tracks[i + 1]!), "Order saved.")}>↓</button>
                    <button className="btn-ghost py-1.5" onClick={() => { setEditing(t.id); setMsg(null); }}>Edit</button>
                    <button className="btn-ghost py-1.5" onClick={() => setConfirmId(t.id)}>Remove</button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
