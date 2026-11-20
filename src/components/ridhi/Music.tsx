import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { DEFAULT_KEY, HOTE_TAK_EXPLANATION, HOTE_TAK_KEY, RECOMMENDED_KEY } from "@/data/playlist";
import { loadSource, onAudioEnded, pauseAudio, playSource, seekAudio, setVolume, useAudio } from "@/lib/audio";
import { useTracks, type PlayTrack } from "@/lib/tracks";
import { useIsEditor } from "@/lib/editor";
import { Equalizer, Vinyl } from "./Vinyl";
import { Notes } from "./Notes";
import { SecretMessage } from "./SecretMessage";

const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
const UNAVAILABLE = "This song hasn't been added yet.";
const FAILED = "This song couldn't be played.";

export function Music() {
  const tracks = useTracks();
  const audio = useAudio();
  const isEditor = useIsEditor();
  const defaultId = (tracks.find((t) => t.key === DEFAULT_KEY) ?? tracks[0])?.id ?? "";
  const [curId, setCurId] = useState<string | null>(null); // null = fresh player → default track (Teri Jhalak)
  const [vol, setVol] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [hoteEnded, setHoteEnded] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [recState, setRecState] = useState<"idle" | "playing" | "unavailable">("idle");
  const [secretOpen, setSecretOpen] = useState(false); // set only after the server accepts the password

  const byId = useMemo(() => new Map(tracks.map((t) => [t.id, t])), [tracks]);
  const track: PlayTrack | undefined = byId.get(curId ?? defaultId) ?? tracks[0];
  const order = useMemo(() => {
    const ids = tracks.map((t) => t.id);
    if (!shuffle) return ids;
    const known = shuffled.filter((id) => byId.has(id));
    return [...known, ...ids.filter((id) => !known.includes(id))];
  }, [tracks, shuffle, shuffled, byId]);
  const pos = track ? order.indexOf(track.id) : -1;

  const mine = !!track && audio.owner === "player" && audio.src !== null && audio.src === track.src;
  const playing = mine && audio.playing;
  const busy = mine && !audio.paused; // play pressed (may still be buffering)

  useEffect(() => { setVolume(vol); }, [vol]);

  const select = (t: PlayTrack, autoplay = true) => {
    setCurId(t.id); setHoteEnded(false); setShowWhy(false); setNote(null);
    if (t.key !== RECOMMENDED_KEY) setRecState("idle");
    if (!t.src) { loadSource("player", null); setNote(UNAVAILABLE); return false; }
    if (!autoplay) { loadSource("player", t.src); return true; }
    void playSource("player", t.src).then((ok) => { if (!ok) setNote(FAILED); });
    return true;
  };

  const step = (d: number) => {
    const n = pos + d;
    if (n < 0 || n >= order.length) return;
    const t = byId.get(order[n]!);
    if (t) select(t);
  };

  const toggle = () => {
    if (!track) return;
    if (!track.src) { setNote(UNAVAILABLE); return; }
    if (busy) { pauseAudio(); return; }
    setNote(null);
    void playSource("player", track.src).then((ok) => { if (!ok) setNote(FAILED); });
  };

  // Natural end of a track: Hote Tak waits for its special button; others repeat or advance.
  const latest = useRef({ track, repeat, step });
  latest.current = { track, repeat, step };
  useEffect(() => onAudioEnded((owner) => {
    if (owner !== "player") return;
    const { track: t, repeat: r, step: s } = latest.current;
    if (!t) return;
    if (t.key === HOTE_TAK_KEY) { setHoteEnded(true); return; }
    if (r && t.src) { void playSource("player", t.src); return; }
    s(1);
  }), []);

  useEffect(() => { if (mine && audio.failed) setNote(FAILED); }, [mine, audio.failed]);

  const toggleShuffle = () => {
    if (!shuffle && track) {
      const rest = tracks.map((t) => t.id).filter((id) => id !== track.id);
      for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rest[i], rest[j]] = [rest[j]!, rest[i]!]; }
      setShuffled([track.id, ...rest]);
    }
    setShuffle(!shuffle);
  };

  const playRecommendation = () => {
    const rec = tracks.find((t) => t.key === RECOMMENDED_KEY);
    if (!rec || !rec.src) { if (rec) { setCurId(rec.id); loadSource("player", null); } setRecState("unavailable"); return; }
    select(rec);
    setRecState("playing");
  };

  if (!track) return null;
  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className={`relative overflow-hidden rounded-[2rem] bg-card p-6 text-center shadow-soft transition-shadow duration-700 md:p-8 ${playing ? "shadow-photo" : ""}`}>
          <Vinyl playing={playing} className="w-48 md:w-56" />
          <div className="mt-6"><Equalizer playing={playing} /></div>
          <h3 className="mt-3 text-3xl">{track.title}</h3>
          <p className="text-sm text-muted-foreground">{track.artist ?? "\u00a0"}</p>
          {note && <p role="status" className="mt-2 text-sm text-rose">{note}</p>}

          <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{fmt(mine ? audio.time : 0)}</span>
            <input type="range" aria-label="Seek" min={0} max={mine ? audio.duration || 0 : 0} step={0.1} value={mine ? audio.time : 0}
              disabled={!mine || !audio.duration} onChange={(e) => seekAudio(+e.target.value)} className="w-full accent-rose" />
            <span>{fmt(mine ? audio.duration : 0)}</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button className={`btn-ghost px-3 ${shuffle ? "bg-accent" : ""}`} aria-pressed={shuffle} aria-label="Shuffle" onClick={toggleShuffle}>⤨</button>
            <button className="btn-ghost px-3" aria-label="Previous" disabled={pos <= 0} onClick={() => step(-1)}>⏮</button>
            <button className="btn-soft h-14 w-14 p-0 text-xl" aria-label={busy ? "Pause" : "Play"} onClick={toggle}>{busy ? "❚❚" : "▶"}</button>
            <button className="btn-ghost px-3" aria-label="Next" disabled={pos >= order.length - 1} onClick={() => step(1)}>⏭</button>
            <button className={`btn-ghost px-3 ${repeat ? "bg-accent" : ""}`} aria-pressed={repeat} aria-label="Repeat current song" onClick={() => setRepeat(!repeat)}>↻</button>
          </div>
          <label className="mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            Volume <input type="range" min={0} max={1} step={0.01} value={vol} onChange={(e) => setVol(+e.target.value)} className="w-32 accent-rose" />
          </label>

          {hoteEnded && track.key === HOTE_TAK_KEY && (
            <div className="animate-fade-up mt-6 space-y-4">
              {!showWhy ? (
                <button className="btn-soft" onClick={() => setShowWhy(true)}>Now you know the song. Want to know why I chose it? ♡</button>
              ) : HOTE_TAK_EXPLANATION ? (
                <p className="whitespace-pre-line rounded-2xl bg-accent p-5 text-left">{HOTE_TAK_EXPLANATION}</p>
              ) : (
                <p className="rounded-2xl bg-accent p-5 font-serif text-lg italic text-heading">Coming soon ♡</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] bg-card p-4 shadow-soft">
          <ol className="max-h-[32rem] space-y-1 overflow-y-auto pr-1">
            {order.map((id, n) => {
              const t = byId.get(id)!; const active = t.id === track.id;
              return (
                <li key={id}>
                  <button onClick={() => select(t)} aria-current={active}
                    className={`flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-left transition-colors ${active ? "bg-accent text-heading" : "hover:bg-secondary"}`}>
                    <span className="w-6 text-xs text-muted-foreground">{n + 1}</span>
                    <span className="flex-1">{t.title}{t.artist && <span className="text-muted-foreground"> — {t.artist}</span>}</span>
                    {!t.src && <span className="text-xs text-muted-foreground">Coming soon</span>}
                    {active && playing && <span className="text-rose">♪</span>}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 flex items-center justify-center gap-4 border-t border-border pt-3">
            {!secretOpen && <SecretMessage onUnlock={() => setSecretOpen(true)} />}
            {isEditor === true && (
              <Link to="/manage" className="text-sm text-muted-foreground underline-offset-4 hover:text-heading hover:underline">Manage Playlist</Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-[2rem] bg-card p-6 text-center shadow-soft md:p-8">
        {secretOpen && (
          <div className="animate-fade-up">
            <h3 className="text-3xl">Recommended Song ♡</h3>
            <button className="btn-soft mt-5" onClick={playRecommendation}>If My Story Had a Soundtrack..</button>
            {recState === "playing" && track.key === RECOMMENDED_KEY && (
              <p className="animate-fade-up mt-4 font-serif text-xl italic text-heading" role="status">
                {playing ? "Now playing: " : ""}{track.title}{track.artist ? ` — ${track.artist}` : ""}
              </p>
            )}
            {recState === "unavailable" && <p role="status" className="mt-4 text-sm text-rose">This song isn't available yet.</p>}
          </div>
        )}
        <Notes divider={secretOpen} />
      </div>
    </div>
  );
}
