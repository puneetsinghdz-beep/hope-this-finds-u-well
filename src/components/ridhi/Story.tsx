import { useEffect, useState } from "react";
import { PHOTOS, POSES } from "@/data/photos";

type Step = "envelope" | "celebrate" | "ethnic" | "chat" | "pose" | "closing";

function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`bg-wash relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-16 ${className}`}>{children}</section>;
}

function Confetti() {
  const [bits] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 4, dur: 6 + Math.random() * 5, size: 6 + Math.random() * 8, rose: i % 2 === 0, heart: i % 5 === 0 })),
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {bits.map((b, i) => (
        <span key={i} className={`absolute top-0 ${b.rose ? "text-rose" : "text-sky"}`}
          style={{ left: `${b.left}%`, fontSize: b.size * 1.6, animation: `confetti-fall ${b.dur}s linear ${b.delay}s infinite` }}>
          {b.heart ? "♡" : "✦"}
        </span>
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
      <Confetti />
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

function Chat({ next }: { next: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = [setTimeout(() => setStage(1), 600), setTimeout(() => setStage(2), 2000), setTimeout(() => setStage(3), 4400), setTimeout(() => setStage(4), 5400)];
    return () => t.forEach(clearTimeout);
  }, []);
  return (
    <Screen>
      <div className="animate-zoom-in w-full max-w-md overflow-hidden rounded-[2rem] bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose to-sky font-serif text-lg text-heading">P</div>
          <div><p className="font-semibold text-heading">Puneet</p><p className="text-xs text-muted-foreground">Active now</p></div>
        </div>
        <div className="flex min-h-80 flex-col gap-3 px-5 py-6">
          {stage >= 1 && <p className="animate-fade-up max-w-[85%] rounded-3xl rounded-bl-md bg-secondary px-4 py-3">One thing I want you to remember…</p>}
          {stage === 2 && (
            <div className="flex w-16 gap-1 rounded-3xl bg-secondary px-4 py-4" aria-label="Puneet is typing">
              {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground" style={{ animation: `dot 1.2s ${i * 0.15}s infinite` }} />)}
            </div>
          )}
          {stage >= 3 && <p className="animate-fade-up max-w-[85%] rounded-3xl rounded-bl-md bg-secondary px-4 py-3">No matter what situations come in your way, please don't change yourself. Keep being the person you are, and never lose the things that make you you.</p>}
        </div>
        <div className="border-t border-border p-4 text-center">
          <button className="btn-soft w-full" disabled={stage < 4} onClick={next}>Okay, I don't 😊</button>
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

const ORDER: Step[] = ["envelope", "celebrate", "ethnic", "chat", "pose", "closing"];

export function Story({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const next = () => { window.scrollTo({ top: 0 }); i + 1 >= ORDER.length ? onDone() : setI(i + 1); };
  const step = ORDER[i];
  return (
    <div key={step} className="animate-fade-in">
      {step === "envelope" && <Envelope onOpen={next} />}
      {step === "celebrate" && <Celebrate next={next} />}
      {step === "ethnic" && <Ethnic next={next} />}
      {step === "chat" && <Chat next={next} />}
      {step === "pose" && <Pose next={next} />}
      {step === "closing" && <Closing next={next} />}
    </div>
  );
}
