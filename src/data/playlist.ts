import teriJhalak from "@/assets/audio/teri-jhalak.mp3.asset.json";
import dua from "@/assets/audio/dua.mp3.asset.json";
import dekhoNa from "@/assets/audio/dekho-na.mp3.asset.json";
import meriBanogiKya from "@/assets/audio/meri-banogi-kya.mp3.asset.json";
import nainoNeBaandhi from "@/assets/audio/naino-ne-baandhi.mp3.asset.json";
import untilIFoundYou from "@/assets/audio/until-i-found-you.mp3.asset.json";
import sangChalogiKya from "@/assets/audio/sang-chalogi-kya.mp3.asset.json";
import sirfTum from "@/assets/audio/sirf-tum.mp3.asset.json";
import hoteTak from "@/assets/audio/hote-tak.mp3.asset.json";
import darkhaast from "@/assets/audio/darkhaast.mp3.asset.json";
import qaafirana from "@/assets/audio/qaafirana.mp3.asset.json";
import kuchToHai from "@/assets/audio/kuch-to-hai.mp3.asset.json";

// Approved default order. The shared playlist lives in the backend (seeded with exactly this list);
// this copy is the offline fallback and the reference the tests check against.
export type Track = { key: string; title: string; artist?: string | undefined; file?: string | undefined };

const FILES: Record<string, string> = {
  "teri-jhalak": teriJhalak.url, dua: dua.url, "dekho-na": dekhoNa.url, "meri-banogi-kya": meriBanogiKya.url,
  "naino-ne-baandhi": nainoNeBaandhi.url, "until-i-found-you": untilIFoundYou.url, "sang-chalogi-kya": sangChalogiKya.url,
  "sirf-tum": sirfTum.url, "hote-tak": hoteTak.url,
};
const ARTISTS: Record<string, string> = { "sirf-tum": "Darshan Raval", "hote-tak": "Papon" };

export const trackKey = (title: string) => title.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const PLAYLIST: Track[] = [
  "Teri Jhalak", "Dua", "Dekho Na", "Fear", "Meri Banogi Kya", "Naino Ne Baandhi", "Qayde Se", "Haara",
  "Door", "Jaana Nahi", "Tu Hai Jahan", "Hope", "Until I Found You", "Kaafi Hai Na", "Sang Chalogi Kya",
  "Tera Naam Doon", "Piya O're Piya", "Tere Sang Yaara", "Sirf Tum", "Tum Mere", "Mila Tujhe",
  "Mai Tujhsa Hogaya", "Baawra", "Halka Halka", "Tujhko", "Mausam", "Darmiyaan Unplugged", "Laute Nahi",
  "Aur Mohabbat Kitni Karoon", "Das Haasil Sau Baaki", "Jab Tak Hai Jaan Title Song", "Hote Tak",
].map((title) => {
  const key = trackKey(title);
  return { key, title, artist: ARTISTS[key], file: FILES[key] };
});

// Songs supplied later (Nov 18); they follow the approved 32, never mixed into them.
export const EXTRA_TRACKS: Track[] = [
  { key: "darkhaast", title: "Darkhaast", file: darkhaast.url },
  { key: "qaafirana", title: "Qaafirana", file: qaafirana.url },
  { key: "kuch-to-hai", title: "Kuch To Hai", file: kuchToHai.url },
];

export const DEFAULT_KEY = "teri-jhalak";
export const RECOMMENDED_KEY = "sirf-tum";
export const HOTE_TAK_KEY = "hote-tak";
// Pending: the approved "why I chose it" explanation has not been supplied yet.
export const HOTE_TAK_EXPLANATION: string | null = null;
