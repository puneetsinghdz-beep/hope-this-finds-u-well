import { useEffect, useRef, useState } from "react";
import { PHOTOS, POSES } from "@/data/photos";

type Step = "envelope" | "celebrate" | "ethnic" | "chat" | "pose" | "teaser" | "closing";

function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`bg-wash relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-16 ${className}`}>{children}</section>;
}

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const CONFETTI_COLORS = ["bg-rose", "bg-sky", "bg-accent", "bg-butter", "bg-card", "bg-secondary"];

/** Full-page party-popper burst + light confetti rain. Lasts ~4s, then fades and unmounts. */
function Celebration() {
  const [on, setOn] = useState(true);
  const [bits] = useState(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return null;
    const small = window.innerWidth < 640;
    const w = window.innerWidth, h = window.innerHeight;
    const poppers = Array.from({ length: small ? 36 : 70 }, (_, i) => {
      const left = i % 2 === 0;
      return {
        kind: "pop" as const, left,
        dx: (left ? 1 : -1) * (0.15 + Math.random() * 0.75) * w,
        dy: -(0.35 + Math.random() * 0.6) * h,
        r: (Math.random() - 0.5) * 900, delay: Math.random() * 0.35, dur: 2.6 + Math.random() * 1.1,
        size: 6 + Math.random() * 7, round: i % 3 === 0, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
      };
    });
    const rain = Array.from({ length: small ? 18 : 36 }, (_, i) => ({
      kind: "rain" as const, x: Math.random() * 100, r: 360 + Math.random() * 540, delay: 0.3 + Math.random() * 1.2,
      dur: 2.4 + Math.random() * 1.2, size: 5 + Math.random() * 6, round: i % 2 === 0, color: CONFETTI_COLORS[(i + 2) % CONFETTI_COLORS.length]!,
    }));
    return [...poppers, ...rain];
  });
  useEffect(() => { const t = setTimeout(() => setOn(false), 4600); return () => clearTimeout(t); }, []);
  if (!on || !bits) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden" style={{ animation: "fade-out .8s 3.8s ease forwards" }}>
      {bits.map((b, i) => b.kind === "pop" ? (
        <span key={i} className={`absolute bottom-0 shadow-soft ${b.color} ${b.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{ [b.left ? "left" : "right"]: "2%", width: b.size, height: b.round ? b.size : b.size * 1.6,
            "--dx": `${b.dx}px`, "--dy": `${b.dy}px`, "--r": `${b.r}deg`,
            animation: `popper ${b.dur}s cubic-bezier(.15,.75,.35,1) ${b.delay}s both` } as React.CSSProperties} />
      ) : (
        <span key={i} className={`absolute top-0 ${b.color} ${b.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{ left: `${b.x}%`, width: b.size, height: b.round ? b.size : b.size * 1.6, "--r": `${b.r}deg`,
            animation: `rain ${b.dur}s linear ${b.delay}s both` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const open = () => { if (opening) return; setOpening(true); setTimeout(onOpen, 1600); };
  return (
    <Screen>
      <div className="flex flex-col items-center gap-10 text-center">
        <p className="animate-fade-up font-serif text-3xl italic text-heading md:text-4xl">A little something, made just for you… ♡</p>
        <button onClick={open} aria-label="Open the envelope" className="animate-zoom-in relative h-48 w-72 [perspective:800px] md:h-56 md:w-84">
          <div className="absolute inset-0 rounded-2xl bg-accent shadow-soft" />
          <div className="absolute inset-x-6 top-4 h-40 rounded-lg bg-card shadow-soft transition-transform"
            style={opening ? { animation: "letter-rise .9s .6s ease forwards" } : undefined}>
            <p className="mt-6 font-serif text-2xl text-heading">♡</p>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-accent [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-x-0 top-0 h-1/2 origin-top bg-rose [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={opening ? { animation: "flap-open .7s ease forwards" } : undefined} />
          <span className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-3xl text-card">♥</span>
        </button>
        <p className="text-sm tracking-widest text-muted-foreground uppercase">Tap to open</p>
      </div>
    </Screen>
  );
}

function Celebrate({ next }: { next: () => void }) {
  return (
    <Screen>
      <Celebration />
      <div className="relative grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="animate-zoom-in relative mx-auto w-full max-w-sm">
          <span aria-hidden className="animate-float absolute -left-6 -top-6 text-5xl text-rose">♡</span>
          <img src={PHOTOS.birthday} alt="Ridhi celebrating her birthday" className="photo aspect-[4/5] w-full" />
        </div>
        <div className="animate-fade-up space-y-5 text-center md:text-left" style={{ animationDelay: ".4s" }}>
          <h1 className="text-4xl md:text-6xl">Wishing you the happiest birthday, Ridhi ♡</h1>
          <p className="font-serif text-2xl italic text-heading">I made a little something for you…</p>
          <p>It's nothing too fancy, just a little corner of the internet filled with things I wanted you to see, smile at, and maybe remember.</p>
          <p>So, take your time, explore a little, and enjoy your day. 🎀</p>
          <button className="btn-soft" onClick={next} aria-label="Continue">→</button>
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
  // 0 header · 1 first msg · 2 typing dots · 3 second msg typing out · 4 reply offered · 5 reply sent
  const [stage, setStage] = useState(0);
  const [typed, setTyped] = useState(0);
  const sent = useRef(false);
  useEffect(() => {
    const t = [setTimeout(() => setStage(1), 600), setTimeout(() => setStage(2), 1900)];
    t.push(setTimeout(() => { setStage(3); if (prefersReducedMotion()) setTyped(MSG_2.length); }, 3500));
    return () => t.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (stage !== 3) return;
    if (typed >= MSG_2.length) { const t = setTimeout(() => setStage(4), 500); return () => clearTimeout(t); }
    const t = setTimeout(() => setTyped((n) => Math.min(MSG_2.length, n + 2)), 32);
    return () => clearTimeout(t);
  }, [stage, typed]);
  const reply = () => {
    if (sent.current) return;
    sent.current = true;
    setStage(5);
    setTimeout(next, 2000);
  };
  return (
    <Screen>
      <div className="animate-zoom-in w-full max-w-md overflow-hidden rounded-[2rem] bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="rounded-full bg-gradient-to-tr from-butter via-rose to-sky p-[2px]">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-card font-serif text-lg text-heading">P</div>
          </div>
          <div><p className="font-semibold text-heading">Puneet</p><p className="text-xs text-muted-foreground">Active now</p></div>
        </div>
        <div className="flex min-h-96 flex-col gap-2 px-4 py-6" aria-live="polite">
          {stage >= 1 && <p className="animate-fade-up max-w-[80%] self-start rounded-3xl rounded-bl-md bg-secondary px-4 py-2.5">{MSG_1}</p>}
          {stage === 2 && (
            <div className="animate-fade-in flex w-16 gap-1 self-start rounded-3xl bg-secondary px-4 py-4" aria-label="Puneet is typing">
              {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground" style={{ animation: `dot 1.2s ${i * 0.15}s infinite` }} />)}
            </div>
          )}
          {stage >= 3 && (
            <p className="animate-fade-up max-w-[80%] self-start rounded-3xl rounded-bl-md bg-secondary px-4 py-2.5" aria-label={MSG_2}>
              <span aria-hidden>{MSG_2.slice(0, typed)}</span>
              {typed < MSG_2.length && <span aria-hidden className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-heading" style={{ animation: "caret 1s steps(1) infinite" }} />}
            </p>
          )}
          {stage === 5 && (
            <div className="mt-2 flex flex-col items-end gap-1 self-end" style={{ animation: "send .45s cubic-bezier(.2,.8,.2,1) both" }}>
              <p className="rounded-3xl rounded-br-md bg-heading px-4 py-2.5 text-primary-foreground">{REPLY}</p>
              <span className="animate-fade-in pr-2 text-[11px] text-muted-foreground" style={{ animationDelay: ".8s" }}>Seen</span>
            </div>
          )}
          <div className="mt-auto flex justify-end pt-4">
            {stage === 4 && (
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
          I have one little recommendation for you… coming soon.… 👀
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
  const next = () => { window.scrollTo({ top: 0 }); if (i + 1 >= ORDER.length) onDone(); else setI(i + 1); };
  const step = ORDER[i];
  return (
    <div key={step} className="animate-fade-in">
      {step === "envelope" && <Envelope onOpen={next} />}
      {step === "celebrate" && <Celebrate next={next} />}
      {step === "ethnic" && <Ethnic next={next} />}
      {step === "chat" && <Chat next={next} />}
      {step === "pose" && <Pose next={next} />}
      {step === "teaser" && <Teaser next={next} />}
      {step === "closing" && <Closing next={next} />}
    </div>
  );
}
