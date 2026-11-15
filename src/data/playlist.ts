// Approved default order. `file` is filled in once the real MP3 is added to public/audio.
export type Track = { title: string; artist?: string; file?: string };

export const PLAYLIST: Track[] = [
  "Teri Jhalak", "Dua", "Dekho Na", "Fear", "Meri Banogi Kya", "Naino Ne Baandhi", "Qayde Se", "Haara",
  "Door", "Jaana Nahi", "Tu Hai Jahan", "Hope", "Until I Found You", "Kaafi Hai Na", "Sang Chalogi Kya",
  "Tera Naam Doon", "Piya O're Piya", "Tere Sang Yaara", "Sirf Tum", "Tum Mere", "Mila Tujhe",
  "Mai Tujhsa Hogaya", "Baawra", "Halka Halka", "Tujhko", "Mausam", "Darmiyaan Unplugged", "Laute Nahi",
  "Aur Mohabbat Kitni Karoon", "Das Haasil Sau Baaki", "Jab Tak Hai Jaan Title Song", "Hote Tak",
].map((title) => (title === "Hote Tak" ? { title, artist: "Papon" } : { title }));

export const HOTE_TAK = "Hote Tak";
// Pending: the approved "why I chose it" explanation has not been supplied yet.
export const HOTE_TAK_EXPLANATION: string | null = null;
