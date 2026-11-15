import { useState } from "react";
import { PHOTOS } from "@/data/photos";

// Approved slide messages are pending; slides show photos only until the exact wording is supplied.
const SLIDES = [PHOTOS.birthday, PHOTOS.yellow, PHOTOS.gold, PHOTOS.floral, PHOTOS.peach, PHOTOS.waterfall, PHOTOS.frame, PHOTOS.seating, PHOTOS.sweater];

export function Wishes() {
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
      <div className="mt-6 flex justify-center gap-3">
        <button className="btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← Previous</button>
        {i < last ? <button className="btn-soft" onClick={() => setI(i + 1)}>Next →</button>
          : <button className="btn-soft" onClick={() => setI(0)}>Replay Story ↺</button>}
      </div>
    </div>
  );
}
