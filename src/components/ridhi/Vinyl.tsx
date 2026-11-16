/** Vinyl record that spins only while real audio is playing (data-playing drives the CSS). */
export function Vinyl({ playing, className = "" }: { playing: boolean; className?: string }) {
  return (
    <div className={`relative mx-auto aspect-square ${className}`}>
      <div aria-hidden className={`player-glow absolute -inset-6 rounded-full transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        style={playing ? { animation: "glow 3.2s ease-in-out infinite" } : undefined} />
      <div data-playing={playing} className="vinyl relative grid h-full w-full place-items-center rounded-full shadow-photo">
        <div aria-hidden className="vinyl-sheen absolute inset-0 rounded-full" />
        <div className="relative grid h-[34%] w-[34%] place-items-center rounded-full bg-gradient-to-br from-rose via-accent to-sky">
          <span className="font-serif text-xs italic text-heading">♡</span>
          <span className="absolute h-[14%] w-[14%] rounded-full bg-background" />
        </div>
      </div>
    </div>
  );
}

export function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div aria-hidden className={`flex h-6 items-end justify-center gap-1 transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}>
      {[0.9, 0.6, 1.1, 0.75, 1, 0.65, 0.85].map((d, i) => (
        <span key={i} className="eq-bar h-full w-1 rounded-full bg-rose"
          style={playing ? { animation: `eq ${d}s ease-in-out ${i * 0.08}s infinite` } : undefined} />
      ))}
    </div>
  );
}
