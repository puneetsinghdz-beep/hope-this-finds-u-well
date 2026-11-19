import { useEffect, useRef, useState } from "react";
import { PHOTOS, POSES } from "@/data/photos";
import { Celebration, type CelebrationVariant } from "./Celebration";

type Step = "envelope" | "celebrate" | "ethnic" | "chat" | "pose" | "teaser" | "closing";

function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`bg-wash relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-16 ${className}`}>{children}</section>;
}

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Envelope({ onBurst, onOpen }: { onBurst: () => void; onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const open = () => {
    if (opening) return; // one tap = one opening, one celebration
    setOpening(true);
    // flap opens (0–.7s) → letter rises (.6–1.5s) → confetti bursts as it lifts → page glides on
    timers.current.push(setTimeout(onBurst, 850), setTimeout(onOpen, 1750));
  };
  return (
    <Screen>
      <div className="flex flex-col items-center gap-10 text-center" style={opening ? { animation: "envelope-out .55s 1.25s ease-in forwards" } : undefined}>
        <p className="animate-fade-up font-serif text-3xl italic text-heading md:text-4xl">There is something I made for u</p>
        <button onClick={open} disabled={opening} aria-label="Open the envelope" className="animate-zoom-in relative h-48 w-72 [perspective:800px] md:h-56 md:w-84">
          <div className="absolute inset-0 rounded-2xl bg-accent shadow-soft" />
          <div className="absolute inset-x-6 top-4 h-40 rounded-lg bg-card shadow-soft transition-transform"
            style={opening ? { animation: "letter-rise .9s .6s cubic-bezier(.2,.7,.2,1) forwards" } : undefined}>
            <p className="mt-6 font-serif text-2xl text-heading">♡</p>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-accent [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-x-0 top-0 h-1/2 origin-top bg-rose [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={opening ? { animation: "flap-open .7s cubic-bezier(.4,0,.2,1) forwards" } : undefined} />
          <span className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-3xl text-card">♥</span>
        </button>
        <p className="text-sm tracking-widest text-muted-foreground uppercase">Tap to open</p>
      </div>
    </Screen>
  );
}

const FLAGS = ["bg-rose", "bg-sky", "bg-accent", "bg-butter"];
const FLOATERS = [
  { g: "♡", c: "left-[6%] top-[22%] text-3xl text-rose", d: "0s" },
  { g: "✦", c: "right-[8%] top-[18%] text-2xl text-sky", d: "1.2s" },
  { g: "♥", c: "left-[10%] bottom-[16%] text-xl text-rose/70", d: "2s" },
  { g: "✦", c: "right-[12%] bottom-[22%] text-lg text-butter", d: ".6s" },
  { g: "♡", c: "right-[4%] top-[55%] text-xl text-rose/60 hidden md:block", d: "2.6s" },
  { g: "✦", c: "left-[3%] top-[60%] text-base text-sky hidden md:block", d: "1.8s" },
];

/** Restrained birthday dressing for the first page: bunting, soft corner glow, a few floating hearts and stars. */
function BirthdayDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent opacity-70 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky opacity-50 blur-3xl" />
      <div className="absolute inset-x-0 top-0 flex justify-center">
        <svg className="absolute top-0 h-10 w-full" preserveAspectRatio="none" viewBox="0 0 100 10"><path d="M0 1 Q50 9 100 1" fill="none" stroke="var(--border)" strokeWidth=".4" /></svg>
        <div className="flex w-full max-w-5xl justify-between px-6 md:px-16">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className={`animate-fade-in block h-6 w-4 origin-top [clip-path:polygon(0_0,100%_0,50%_100%)] md:h-8 md:w-6 ${FLAGS[i % 4]} ${i > 8 ? "hidden md:block" : ""}`}
              style={{ marginTop: `${Math.sin((i / 10) * Math.PI) * 26 + 2}px`, animation: `fade-in .8s ${0.2 + i * 0.06}s both, sway ${3 + (i % 3)}s ${i * 0.2}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>
      {FLOATERS.map((f, i) => <span key={i} className={`animate-float absolute ${f.c}`} style={{ animationDelay: f.d }}>{f.g}</span>)}
    </div>
  );
}

function Celebrate({ next }: { next: () => void }) {
  return (
    <Screen>
      <BirthdayDecor />
      <div className="relative grid max-w-5xl items-center gap-10 pt-6 md:grid-cols-2">
        <div className="animate-zoom-in relative mx-auto w-full max-w-sm" style={{ animationDelay: ".15s" }}>
          <span aria-hidden className="animate-float absolute -left-6 -top-6 z-10 text-5xl text-rose">♡</span>
          <span aria-hidden className="animate-float absolute -bottom-4 -right-4 z-10 text-3xl text-sky" style={{ animationDelay: "1.5s" }}>✦</span>
          <div className="rotate-[-2deg] rounded-[1.6rem] bg-card p-3 shadow-photo">
            <img src={PHOTOS.birthday} alt="Ridhi celebrating her birthday" className="aspect-[4/5] w-full rounded-[1.25rem] object-cover" />
          </div>
        </div>
        <div className="space-y-5 text-center md:text-left">
          <h1 className="animate-fade-up text-4xl md:text-6xl" style={{ animationDelay: ".45s" }}>Wishing you the happiest birthday, Ridhi ♡</h1>
          <p className="animate-fade-up font-serif text-2xl italic text-heading" style={{ animationDelay: ".8s" }}>I made a little something for you…</p>
          <p className="animate-fade-up" style={{ animationDelay: "1.1s" }}>It's nothing too fancy, just a little corner of the internet filled with things I wanted you to see, smile at, and maybe remember.</p>
          <p className="animate-fade-up" style={{ animationDelay: "1.35s" }}>So, take your time, explore a little, and enjoy your day. 🎀</p>
          <button className="btn-soft animate-fade-up" style={{ animationDelay: "1.7s" }} onClick={next} aria-label="Continue">→</button>
        </div>
      </div>
    </Screen>
  );
}

function Ethnic({ next }: { next: () => void }) {
  const tiles = [
    { src: PHOTOS.yellow, cls: "md:col-span-2 md:row-span-2 aspect-[4/5]" },
    { src: PHOTOS.gold, cls: "aspect-[4/5]" },
    { src: PHOTOS.floral, cls: "aspect-[4/5]" },
    { src: PHOTOS.peach, cls: "md:col-span-2 aspect-[16/10]" },
  ];
  return (
    <Screen>
      <div className="w-full max-w-5xl space-y-10">
        <h2 className="animate-fade-up text-center text-3xl md:text-5xl">The Ethnic Era: The Outfit Development vs. The Pose Development… 💀</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {tiles.map((t, i) => (
            <img key={i} src={t.src} alt="Ridhi in an ethnic outfit" className={`photo animate-zoom-in h-full w-full ${t.cls}`} style={{ animationDelay: `${0.3 + i * 0.25}s` }} />
          ))}
        </div>
        <div className="text-center"><button className="btn-soft" onClick={next} aria-label="Continue">→</button></div>
      </div>
    </Screen>
  );
}

const MSG_1 = "One thing I want you to remember…";
const MSG_2 = "No matter what situations come in your way, please don't change yourself. Keep being the person you are, and never lose the things that make you you.";
const REPLY = "Yeah yeah! ik😅";

function Chat({ next }: { next: () => void }) {
  // 0 header · 1 typing · 2 first msg · 3 typing · 4 second msg typing out · 5 reply offered · 6 reply sent · 7 seen
  const [stage, setStage] = useState(0);
  const [typed, setTyped] = useState(0);
  const sent = useRef(false);
  const later = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const calm = prefersReducedMotion();
    const t = [
      setTimeout(() => setStage(1), 700),
      setTimeout(() => setStage(2), 1900),
      setTimeout(() => setStage(3), 3300),
      setTimeout(() => { setStage(4); if (calm) setTyped(MSG_2.length); }, 5100),
    ];
    return () => { t.forEach(clearTimeout); later.current.forEach(clearTimeout); };
  }, []);
  useEffect(() => {
    if (stage !== 4) return;
    if (typed >= MSG_2.length) { const t = setTimeout(() => setStage(5), 1300); return () => clearTimeout(t); }
    const t = setTimeout(() => setTyped((n) => Math.min(MSG_2.length, n + 2)), 38);
    return () => clearTimeout(t);
  }, [stage, typed]);
  const reply = () => {
    if (sent.current) return;
    sent.current = true;
    setStage(6);
    later.current.push(setTimeout(() => setStage(7), 900), setTimeout(next, 2600));
  };
  const dots = (
    <div className="animate-fade-in flex w-16 gap-1 self-start rounded-3xl bg-secondary px-4 py-4" aria-label="Puneet is typing">
      {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground" style={{ animation: `dot 1.2s ${i * 0.15}s infinite` }} />)}
    </div>
  );
  return (
    <Screen>
      <div className="animate-zoom-in w-full max-w-md overflow-hidden rounded-[2rem] bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="rounded-full bg-gradient-to-tr from-butter via-rose to-sky p-[2px]">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-card font-serif text-lg text-heading">P</div>
          </div>
          <div><p className="font-semibold text-heading">Puneet</p><p className="text-xs text-muted-foreground">{stage === 1 || stage === 3 || (stage === 4 && typed < MSG_2.length) ? "typing…" : "Active now"}</p></div>
        </div>
        <div className="flex min-h-96 flex-col gap-2 px-4 py-6" aria-live="polite">
          {stage === 1 && dots}
          {stage >= 2 && <p className="max-w-[80%] self-start rounded-3xl rounded-bl-md bg-secondary px-4 py-2.5" style={{ animation: "send .45s cubic-bezier(.2,.8,.2,1) both" }}>{MSG_1}</p>}
          {stage === 3 && dots}
          {stage >= 4 && (
            <p className="max-w-[80%] self-start rounded-3xl rounded-bl-md bg-secondary px-4 py-2.5" style={{ animation: "send .45s cubic-bezier(.2,.8,.2,1) both" }} aria-label={MSG_2}>
              <span aria-hidden>{MSG_2.slice(0, typed)}</span>
              {typed < MSG_2.length && <span aria-hidden className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-heading" style={{ animation: "caret 1s steps(1) infinite" }} />}
            </p>
          )}
          {stage >= 6 && (
            <div className="mt-2 flex flex-col items-end gap-1 self-end" style={{ animation: "send .45s cubic-bezier(.2,.8,.2,1) both" }}>
              <p className="rounded-3xl rounded-br-md bg-heading px-4 py-2.5 text-primary-foreground">{REPLY}</p>
              {stage >= 7 && <span className="animate-fade-in text-[11px] text-muted-foreground">Seen</span>}
            </div>
          )}
          <div className="mt-auto flex justify-end pt-4">
            {stage === 5 && (
              <button onClick={reply} className="animate-fade-up rounded-full border border-rose bg-card px-4 py-2 text-sm text-heading shadow-soft transition-colors hover:bg-accent">
                {REPLY}
              </button>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}

function Pose({ next }: { next: () => void }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= 5) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 900 : 1500);
    return () => clearTimeout(t);
  }, [shown]);
  const collage = shown >= 5;
  const tilt = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3"];
  return (
    <Screen>
      <div className="w-full max-w-5xl space-y-10 text-center">
        <h2 className="animate-fade-up text-3xl md:text-5xl">But plz change the pose from your default setting 😭</h2>
        {!collage ? (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            {POSES.slice(0, shown).map((src, i) => (
              <img key={i} src={src} alt="Ridhi in her signature pose" className={`photo animate-zoom-in absolute inset-0 h-full w-full ${tilt[i]}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {POSES.map((src, i) => (
              <img key={i} src={src} alt="Ridhi in her signature pose" className={`photo animate-zoom-in aspect-[3/4] w-full ${tilt[i]}`} style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
        {collage && (
          <div className="animate-fade-up space-y-6" style={{ animationDelay: ".7s" }}>
            <p className="font-serif text-2xl italic text-heading md:text-3xl">Different day. Different moment. Same pose. 😭</p>
            <button className="btn-soft" onClick={next} aria-label="Continue">→</button>
          </div>
        )}
      </div>
    </Screen>
  );
}

function Teaser({ next }: { next: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 2600); return () => clearTimeout(t); }, []);
  return (
    <Screen>
      <div className="flex max-w-2xl flex-col items-center gap-12 text-center">
        <span aria-hidden className="animate-float text-3xl text-rose">✦</span>
        <p className="animate-fade-up font-serif text-3xl italic leading-snug text-heading md:text-5xl" style={{ animationDuration: "1.6s" }}>
          There is something recommended to come... coming soon... 👀
        </p>
        <div className="h-12">{ready && <button className="btn-soft animate-fade-in" onClick={next} aria-label="Continue">→</button>}</div>
      </div>
    </Screen>
  );
}

function Closing({ next }: { next: () => void }) {
  return (
    <Screen>
      <div className="flex flex-col items-center gap-8 text-center">
        <img src={PHOTOS.birthday} alt="Ridhi on her birthday" className="photo animate-zoom-in aspect-[4/5] w-full max-w-xs" />
        <h2 className="animate-fade-up text-5xl md:text-6xl" style={{ animationDelay: ".4s" }}>Hope u like it ♡</h2>
        <button className="btn-soft animate-fade-up" style={{ animationDelay: ".8s" }} onClick={next}>See what comes next →</button>
      </div>
    </Screen>
  );
}

const ORDER: Step[] = ["envelope", "celebrate", "ethnic", "chat", "pose", "teaser", "closing"];

export function Story({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  // each fire gets a new id → a fresh Celebration mount; re-renders never re-fire it
  const [burst, setBurst] = useState<{ id: number; variant: CelebrationVariant } | null>(null);
  const fire = (variant: CelebrationVariant) => setBurst((b) => ({ id: (b?.id ?? 0) + 1, variant }));
  const next = () => {
    window.scrollTo({ top: 0 });
    if (i + 1 >= ORDER.length) { onDone(); return; }
    if (ORDER[i + 1] === "closing") fire("finale");
    setI(i + 1);
  };
  const step = ORDER[i];
  return (
    <>
    {burst && <Celebration key={burst.id} variant={burst.variant} />}
    <div key={step} className="animate-fade-in">
      {step === "envelope" && <Envelope onBurst={() => fire("open")} onOpen={next} />}
      {step === "celebrate" && <Celebrate next={next} />}
      {step === "ethnic" && <Ethnic next={next} />}
      {step === "chat" && <Chat next={next} />}
      {step === "pose" && <Pose next={next} />}
      {step === "teaser" && <Teaser next={next} />}
      {step === "closing" && <Closing next={next} />}
    </div>
    </>
  );
}
