import { useEffect, useState } from "react";
import { LETTER } from "@/data/letter";
import { HOTE_TAK_KEY } from "@/data/playlist";
import { checkLetterCode } from "@/lib/letter-gate";
import { onAudioEnded, pauseAudio, playSource, useAudio } from "@/lib/audio";
import { useTracks } from "@/lib/tracks";
import { Vinyl } from "./Vinyl";

type Step = "gate" | "letter" | "hope" | "song" | "end";

/** "Before you go…": playful code gate → unchanged letter → hope → Hote Tak → gentle ending. */
export function LetterFlow({ unlocked, onUnlock, onClose }: { unlocked: boolean; onUnlock: () => void; onClose: () => void }) {
  const [step, setStep] = useState<Step>(unlocked ? "letter" : "gate");
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const [checking, setChecking] = useState(false);
  const [songState, setSongState] = useState<"idle" | "started" | "unavailable" | "ended">("idle");
  const tracks = useTracks();
  const hote = tracks.find((t) => t.key === HOTE_TAK_KEY);
  const audio = useAudio();
  const mine = audio.owner === "letter";

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => onAudioEnded((owner) => { if (owner === "letter") setSongState("ended"); }), []);
  useEffect(() => { if (mine && audio.failed && songState === "started") setSongState("unavailable"); }, [mine, audio.failed, songState]);

  const close = () => { if (mine) pauseAudio(); onClose(); };

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    const ok = await checkLetterCode(code);
    setChecking(false);
    if (ok) { setWrong(false); onUnlock(); setStep("letter"); } else setWrong(true);
  };

  const startSong = () => {
    if (songState !== "idle") return;
    setStep("song");
    if (!hote?.src) { setSongState("unavailable"); return; }
    setSongState("started");
    void playSource("letter", hote.src).then((ok) => { if (!ok) setSongState("unavailable"); });
  };

  const wrap = "animate-fade-up relative mx-auto max-w-2xl rounded-[1.5rem] bg-card px-7 py-12 shadow-photo md:px-14";
  return (
    <div role="dialog" aria-modal="true" aria-label="Before you go" className="animate-fade-in fixed inset-0 z-50 overflow-y-auto bg-heading/40 px-4 py-10 backdrop-blur-sm" onClick={close}>
      <article key={step} onClick={(e) => e.stopPropagation()} className={wrap}>
        <button onClick={close} aria-label="Close" className="absolute right-5 top-4 text-2xl text-muted-foreground hover:text-heading">×</button>

        {step === "gate" && (
          <form onSubmit={unlock} className="mx-auto max-w-sm space-y-6 py-6 text-center">
            <p className="text-2xl text-rose">♡</p>
            <label htmlFor="letter-code" className="block font-serif text-2xl text-heading">Enter the code to open this letter</label>
            <input id="letter-code" inputMode="numeric" autoComplete="off" pattern="[0-9 ]*" value={code} autoFocus
              onChange={(e) => { setCode(e.target.value); setWrong(false); }}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-center text-xl tracking-[0.3em] outline-none focus:ring-2 focus:ring-ring" />
            {wrong && <p role="alert" className="text-sm text-rose">Hmm, that's not it. Try again ♡</p>}
            <button type="submit" className="btn-soft" disabled={!code.trim() || checking}>Unlock</button>
          </form>
        )}

        {step === "letter" && (
          <>
            <p className="mb-8 text-center text-2xl text-rose">♡</p>
            <div className="space-y-5 font-serif text-xl leading-relaxed text-heading">
              {LETTER.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-12 text-center">
              <button className="btn-soft" onClick={() => setStep("hope")}>I've read your message till the end ♡</button>
            </div>
          </>
        )}

        {step === "hope" && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-12 text-center">
            <p className="animate-fade-up font-serif text-3xl italic leading-snug text-heading md:text-4xl" style={{ animationDuration: "1.6s" }}>
              Some things take time. That doesn't mean they can't get better. ♡
            </p>
            <button className="btn-soft animate-fade-in" style={{ animationDelay: "1.4s" }} onClick={startSong}>There's still hope, right? ♡</button>
          </div>
        )}

        {step === "song" && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 text-center">
            <Vinyl playing={mine && audio.playing} className="w-44 md:w-52" />
            {songState === "unavailable" ? (
              <p role="status" className="text-muted-foreground">This song isn't available just yet ♡</p>
            ) : hote ? (
              <div>
                <p className="font-serif text-2xl text-heading">{hote.title}</p>
                {hote.artist && <p className="text-sm text-muted-foreground">{hote.artist}</p>}
              </div>
            ) : null}
            {songState === "started" && mine && (
              <button className="btn-ghost" onClick={() => (audio.paused ? playSource("letter", hote!.src) : pauseAudio())}
                aria-label={audio.paused ? "Play" : "Pause"}>{audio.paused ? "▶" : "❚❚"}</button>
            )}
            {(songState === "ended" || songState === "unavailable") && (
              <button className="btn-soft animate-fade-up" onClick={() => setStep("end")}>I'm still figuring things out… ♡</button>
            )}
          </div>
        )}

        {step === "end" && (
          <div className="flex min-h-[50vh] items-center justify-center text-center">
            <p className="animate-fade-up font-serif text-3xl italic leading-snug text-heading md:text-4xl" style={{ animationDuration: "1.6s" }}>
              That's okay. You don't have to figure everything out right now. Take your time. ♡
            </p>
          </div>
        )}
      </article>
    </div>
  );
}
