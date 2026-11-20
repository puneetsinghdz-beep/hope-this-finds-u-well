import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { PHOTOS } from "@/data/photos";

// Approved slide messages are pending; slides show photos only until the exact wording is supplied.
const SLIDES = [PHOTOS.birthday, PHOTOS.yellow, PHOTOS.gold, PHOTOS.floral, PHOTOS.peach, PHOTOS.waterfall, PHOTOS.frame, PHOTOS.seating, PHOTOS.sweater];

export function Wishes({ onReplay }: { onReplay: () => void }) {
  const [i, setI] = useState(0);
  const last = SLIDES.length - 1;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-photo">
        <img key={i} src={SLIDES[i]} alt="A photo of Ridhi" className="animate-ken-burns h-full w-full object-cover" />
      </div>
      <div className="mt-6 flex justify-center gap-2" aria-hidden>
        {SLIDES.map((_, n) => <span key={n} className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-rose" : "w-1.5 bg-sky"}`} />)}
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <button className="btn-ghost justify-self-end" disabled={i === 0} onClick={() => setI(i - 1)}>← Previous</button>
        <span className="group relative inline-flex">
          <button onClick={onReplay} aria-label="Replay Story" title="Replay Story"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-heading shadow-soft transition-all hover:-rotate-45 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90">
            <RotateCcw className="h-4 w-4" aria-hidden />
          </button>
          <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-heading px-3 py-1 text-xs text-primary-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">Replay Story</span>
        </span>
        <button className="btn-soft justify-self-start" disabled={i === last} onClick={() => setI(i + 1)}>Next →</button>
      </div>
    </div>
  );
}
