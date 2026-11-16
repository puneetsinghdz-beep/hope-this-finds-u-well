import { useSyncExternalStore } from "react";

// One shared <audio> element for the whole site, so two songs can never overlap.
// `owner` says which experience (main player or the letter) is using it right now.
export type Owner = "player" | "letter";
export type AudioSnap = {
  owner: Owner | null;
  src: string | null;
  playing: boolean; // genuinely producing sound (not buffering, not paused)
  paused: boolean;
  time: number;
  duration: number;
  failed: boolean;
};

const IDLE: AudioSnap = { owner: null, src: null, playing: false, paused: true, time: 0, duration: 0, failed: false };
let el: HTMLAudioElement | null = null;
let snap: AudioSnap = IDLE;
const subs = new Set<() => void>();
const endedSubs = new Set<(owner: Owner | null) => void>();

function set(p: Partial<AudioSnap>) {
  snap = { ...snap, ...p };
  subs.forEach((f) => f());
}

function audio() {
  if (!el) {
    const a = new Audio();
    a.preload = "metadata";
    a.addEventListener("playing", () => set({ playing: true, paused: false, failed: false }));
    a.addEventListener("waiting", () => set({ playing: false }));
    a.addEventListener("play", () => set({ paused: false }));
    a.addEventListener("pause", () => set({ playing: false, paused: true }));
    a.addEventListener("timeupdate", () => set({ time: a.currentTime }));
    a.addEventListener("loadedmetadata", () => set({ duration: a.duration }));
    a.addEventListener("durationchange", () => set({ duration: a.duration }));
    a.addEventListener("ended", () => {
      set({ playing: false, paused: true });
      endedSubs.forEach((f) => f(snap.owner));
    });
    a.addEventListener("error", () => {
      if (snap.src) set({ playing: false, paused: true, failed: true });
    });
    el = a;
  }
  return el;
}

/** Point the shared element at a source without playing it. `null` = unavailable. */
export function loadSource(owner: Owner, src: string | null) {
  const a = audio();
  a.pause();
  if (src) a.src = src;
  else { a.removeAttribute("src"); a.load(); }
  set({ owner, src, playing: false, paused: true, time: 0, duration: 0, failed: false });
}

/** Play `src` for `owner` (call from a click handler). Resolves true only if playback really started. */
export async function playSource(owner: Owner, src: string | null): Promise<boolean> {
  if (!src) { loadSource(owner, null); return false; }
  if (snap.owner !== owner || snap.src !== src) loadSource(owner, src);
  try {
    await audio().play();
    return true;
  } catch (e) {
    if ((e as Error)?.name !== "AbortError") set({ playing: false, paused: true, failed: true });
    return false;
  }
}

export function pauseAudio() { el?.pause(); }
export function seekAudio(t: number) { if (el) { el.currentTime = t; set({ time: t }); } }
export function setVolume(v: number) { audio().volume = v; }
export function onAudioEnded(cb: (owner: Owner | null) => void) {
  endedSubs.add(cb);
  return () => { endedSubs.delete(cb); };
}

export function useAudio(): AudioSnap {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => snap,
    () => IDLE,
  );
}
