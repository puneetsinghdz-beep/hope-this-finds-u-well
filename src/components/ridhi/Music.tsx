import { useEffect, useMemo, useRef, useState } from "react";
import { HOTE_TAK, HOTE_TAK_EXPLANATION, PLAYLIST } from "@/data/playlist";

const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

export function Music() {
  const audio = useRef<HTMLAudioElement>(null);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [order, setOrder] = useState<number[]>(() => PLAYLIST.map((_, i) => i));
  const [error, setError] = useState<string | null>(null);
  const [hoteEnded, setHoteEnded] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [suggest, setSuggest] = useState("");

  const track = PLAYLIST[cur]!;
  const available = !!track.file;

  useEffect(() => {
    if (shuffle) {
      const rest = PLAYLIST.map((_, i) => i).filter((i) => i !== cur);
      for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rest[i], rest[j]] = [rest[j]!, rest[i]!]; }
      setOrder([cur, ...rest]);
    } else setOrder(PLAYLIST.map((_, i) => i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle]);

  useEffect(() => { if (audio.current) audio.current.volume = vol; }, [vol]);

  const select = (i: number, autoplay = true) => {
    setCur(i); setHoteEnded(false); setShowWhy(false); setError(null); setTime(0); setDur(0);
    const a = audio.current; if (!a) return;
    a.pause(); setPlaying(false);
    const t = PLAYLIST[i]!;
    if (!t.file) { a.removeAttribute("src"); a.load(); setError("This song hasn't been added yet."); return; }
    a.src = t.file;
    if (autoplay) a.play().then(() => setPlaying(true)).catch(() => setError("This song couldn't be loaded."));
  };
  const step = (d: number) => { const p = order.indexOf(cur); const n = p + d; if (n < 0 || n >= order.length) return false; select(order[n]!); return true; };

  const toggle = () => {
    const a = audio.current; if (!a) return;
    if (!available) { setError("This song hasn't been added yet."); return; }
    if (!a.src) a.src = track.file!;
    if (playing) { a.pause(); setPlaying(false); }
    else a.play().then(() => setPlaying(true)).catch(() => setError("This song couldn't be loaded."));
  };

  const onEnded = () => {
    setPlaying(false);
    if (track.title === HOTE_TAK) setHoteEnded(true);
    if (repeat) { audio.current!.currentTime = 0; audio.current!.play().then(() => setPlaying(true)); return; }
    if (track.title !== HOTE_TAK) step(1);
  };

  const pos = useMemo(() => order.indexOf(cur), [order, cur]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <audio ref={audio} preload="metadata" onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onEnded={onEnded} onPause={() => setPlaying(false)}
        onError={() => { if (available) { setError("This song couldn't be loaded."); setPlaying(false); } }} />

      <div className="rounded-[2rem] bg-card p-6 text-center shadow-soft md:p-8">
        <div className={`mx-auto grid aspect-square w-48 place-items-center rounded-full bg-heading shadow-photo md:w-56 ${playing ? "animate-spin-slow" : ""}`}>
          <div className="grid h-1/3 w-1/3 place-items-center rounded-full bg-gradient-to-br from-rose to-sky"><span className="h-3 w-3 rounded-full bg-heading" /></div>
        </div>
        <h3 className="mt-6 text-3xl">{track.title}</h3>
        <p className="text-sm text-muted-foreground">{track.artist ?? "\u00a0"}</p>
        {error && <p role="status" className="mt-2 text-sm text-rose">{error}</p>}

        <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{fmt(time)}</span>
          <input type="range" aria-label="Seek" min={0} max={dur || 0} step={0.1} value={time} disabled={!dur}
            onChange={(e) => { const v = +e.target.value; if (audio.current) audio.current.currentTime = v; setTime(v); }} className="w-full accent-rose" />
          <span>{fmt(dur)}</span>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button className={`btn-ghost px-3 ${shuffle ? "bg-accent" : ""}`} aria-pressed={shuffle} aria-label="Shuffle" onClick={() => setShuffle(!shuffle)}>⤨</button>
          <button className="btn-ghost px-3" aria-label="Previous" disabled={pos <= 0} onClick={() => step(-1)}>⏮</button>
          <button className="btn-soft h-14 w-14 p-0 text-xl" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>{playing ? "❚❚" : "▶"}</button>
          <button className="btn-ghost px-3" aria-label="Next" disabled={pos >= order.length - 1} onClick={() => step(1)}>⏭</button>
          <button className={`btn-ghost px-3 ${repeat ? "bg-accent" : ""}`} aria-pressed={repeat} aria-label="Repeat current song" onClick={() => setRepeat(!repeat)}>↻</button>
        </div>
        <label className="mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          Volume <input type="range" min={0} max={1} step={0.01} value={vol} onChange={(e) => setVol(+e.target.value)} className="w-32 accent-rose" />
        </label>

        {hoteEnded && track.title === HOTE_TAK && (
          <div className="animate-fade-up mt-6 space-y-4">
            {!showWhy ? (
              <button className="btn-soft" onClick={() => setShowWhy(true)}>Now you know the song. Want to know why I chose it? ♡</button>
            ) : HOTE_TAK_EXPLANATION ? (
              <p className="whitespace-pre-line rounded-2xl bg-accent p-5 text-left">{HOTE_TAK_EXPLANATION}</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="rounded-[2rem] bg-card p-4 shadow-soft">
        <ol className="max-h-[32rem] space-y-1 overflow-y-auto pr-1">
          {order.map((i, n) => {
            const t = PLAYLIST[i]!; const active = i === cur;
            return (
              <li key={i}>
                <button onClick={() => select(i)} aria-current={active}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-left transition-colors ${active ? "bg-accent text-heading" : "hover:bg-secondary"}`}>
                  <span className="w-6 text-xs text-muted-foreground">{n + 1}</span>
                  <span className="flex-1">{t.title}{t.artist && <span className="text-muted-foreground"> — {t.artist}</span>}</span>
                  {!t.file && <span className="text-xs text-muted-foreground">Coming soon</span>}
                  {active && playing && <span className="text-rose">♪</span>}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 border-t border-border p-3">
          <label htmlFor="suggest" className="text-sm text-muted-foreground">Got a song I should hear? ♡</label>
          <input id="suggest" value={suggest} onChange={(e) => setSuggest(e.target.value)} placeholder="Song name & artist"
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
          {suggest && <p className="mt-2 text-xs text-muted-foreground">Kept here on your screen — tell me about it ♡</p>}
        </div>
      </div>
    </div>
  );
}
