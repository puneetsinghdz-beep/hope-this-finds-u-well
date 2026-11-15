import { useEffect, useState } from "react";
import { LETTER } from "@/data/letter";
import { Music } from "./Music";
import { Quiz } from "./Quiz";
import { Wishes } from "./Wishes";

function Section({ id, eyebrow, title, sub, children }: { id: string; eyebrow?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-12 text-center">
        {eyebrow && <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-muted-foreground">{eyebrow}</p>}
        <h2 className="text-4xl md:text-5xl">{title}</h2>
        {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

export function Home() {
  const [letter, setLetter] = useState(false);
  useEffect(() => { document.body.style.overflow = letter ? "hidden" : ""; }, [letter]);
  return (
    <main className="bg-wash animate-fade-in min-h-screen">
      <header className="px-5 pt-24 pb-8 text-center">
        <h1 className="animate-fade-up text-5xl md:text-7xl">The Ridhi Experience ♡</h1>
        <p className="animate-fade-up mx-auto mt-5 max-w-xl font-serif text-xl italic text-heading" style={{ animationDelay: ".3s" }}>
          A little collection of wishes, memories, chaos, and surprises — made just for you.
        </p>
      </header>

      <Section id="wishes" title="Birthday Wishes for Ridhi"><Wishes /></Section>
      <Section id="quiz" eyebrow="A LITTLE SPACE TO BE YOURSELF" title="The Little Things That Make You, You ♡" sub="A few choices, a few stories, a little more of your world. 👀"><Quiz /></Section>
      <Section id="music" title="A song for you 🎶" sub="A little collection of songs, just for your little corner of the world. ♡"><Music /></Section>

      <footer className="pb-16 text-center">
        <button onClick={() => setLetter(true)} className="font-serif text-xl italic text-muted-foreground underline-offset-8 transition-colors hover:text-heading hover:underline">Before you go…</button>
      </footer>

      {letter && (
        <div role="dialog" aria-modal="true" aria-label="A letter" className="animate-fade-in fixed inset-0 z-50 overflow-y-auto bg-heading/40 px-4 py-10 backdrop-blur-sm" onClick={() => setLetter(false)}>
          <article onClick={(e) => e.stopPropagation()} className="animate-fade-up relative mx-auto max-w-2xl rounded-[1.5rem] bg-card px-7 py-12 shadow-photo md:px-14">
            <button onClick={() => setLetter(false)} aria-label="Close letter" className="absolute right-5 top-4 text-2xl text-muted-foreground hover:text-heading">×</button>
            <p className="mb-8 text-center text-2xl text-rose">♡</p>
            <div className="space-y-5 font-serif text-xl leading-relaxed text-heading">
              {LETTER.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
