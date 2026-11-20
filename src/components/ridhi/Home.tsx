import { useState } from "react";
import { LetterFlow } from "./LetterFlow";
import { Music } from "./Music";
import { Quiz } from "./Quiz";
import { Wishes } from "./Wishes";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useIsOwner } from "@/lib/editor";

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

export function Home({ onReplay }: { onReplay: () => void }) {
  const [letter, setLetter] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const isOwner = useIsOwner(); // inbox shortcut is only shown to the signed-in owner
  return (
    <main className="bg-wash animate-fade-in min-h-screen">
      <header className="px-5 pt-24 pb-8 text-center">
        <h1 className="animate-fade-up text-5xl md:text-7xl">The Ridhi Experience ♡</h1>
        <p className="animate-fade-up mx-auto mt-5 max-w-xl font-serif text-xl italic text-heading" style={{ animationDelay: ".3s" }}>
          A little corner for you, hope it matches your vibe
        </p>
      </header>

      <Section id="wishes" title="Birthday Wishes for Ridhi"><Wishes onReplay={onReplay} /></Section>
      <Section id="quiz" eyebrow="A LITTLE SPACE TO BE YOURSELF" title="The Little Things That Make You, You ♡" sub="A few choices, a few stories, a little more of your world. 👀"><Quiz /></Section>
      <Section id="music" title="Playlist for you 🎶" sub="A little collection of songs, just for your little corner of the world. ♡"><Music /></Section>

      <footer className="pb-16 text-center">
        <button onClick={() => setLetter(true)} className="font-serif text-xl italic text-muted-foreground underline-offset-8 transition-colors hover:text-heading hover:underline">Before you go…</button>
        {isOwner === true && (
          <div className="mt-6"><Link to="/inbox" aria-label="Inbox" title="Inbox" className="inline-grid h-9 w-9 place-items-center rounded-full text-muted-foreground opacity-60 hover:bg-accent hover:opacity-100"><Mail className="h-4 w-4" aria-hidden /></Link></div>
        )}
      </footer>

      {letter && <LetterFlow unlocked={unlocked} onUnlock={() => setUnlocked(true)} onClose={() => setLetter(false)} />}
    </main>
  );
}
