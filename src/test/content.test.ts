import { describe, expect, it } from "vitest";
import { QUIZ, RATING_LABELS } from "@/data/quiz";
import { DEFAULT_KEY, PLAYLIST, RECOMMENDED_KEY } from "@/data/playlist";
import { checkLetterCode } from "@/lib/letter-gate";
import { validateAudioFile, validateAudioUrl } from "@/lib/playlist-admin";

describe("approved content", () => {
  it("has exactly 25 quiz questions", () => expect(QUIZ).toHaveLength(25));
  it("has five rating levels", () => expect(RATING_LABELS).toHaveLength(5));
  it("Q12 has four separate options in the approved order", () => {
    expect(QUIZ[11]!.options!.map((o) => o.label)).toEqual(["Ohhh shitt, bhul gayi 💀", "Blinkit kr dungi, ruk", "A and B 😭", "Other (write your own) ✍️"]);
  });
  it("has 32 tracks starting with Teri Jhalak and ending with Hote Tak", () => {
    expect(PLAYLIST).toHaveLength(32);
    expect(PLAYLIST[0]?.title).toBe("Teri Jhalak");
    expect(PLAYLIST[31]?.title).toBe("Hote Tak");
  });
  it("defaults to Teri Jhalak and recommends Sirf Tum — Darshan Raval", () => {
    expect(PLAYLIST.find((t) => t.key === DEFAULT_KEY)?.title).toBe("Teri Jhalak");
    const rec = PLAYLIST.find((t) => t.key === RECOMMENDED_KEY);
    expect([rec?.title, rec?.artist]).toEqual(["Sirf Tum", "Darshan Raval"]);
  });
  it("connects exactly the 9 uploaded songs", () => {
    expect(PLAYLIST.filter((t) => t.file).map((t) => t.title)).toEqual([
      "Teri Jhalak", "Dua", "Dekho Na", "Meri Banogi Kya", "Naino Ne Baandhi", "Until I Found You", "Sang Chalogi Kya", "Sirf Tum", "Hote Tak",
    ]);
  });
});

describe("letter code", () => {
  it("opens with 13112026", async () => expect(await checkLetterCode("13112026")).toBe(true));
  it("accepts a pasted code with spaces", async () => expect(await checkLetterCode(" 1311 2026 ")).toBe(true));
  it("rejects a truncated 4-digit code", async () => expect(await checkLetterCode("1311")).toBe(false));
  it("rejects a wrong code", async () => expect(await checkLetterCode("13112025")).toBe(false));
});

describe("playlist upload checks", () => {
  it("accepts an MP3 under 30 MB", () => expect(validateAudioFile({ name: "song.mp3", type: "audio/mpeg", size: 5e6 })).toBeNull());
  it("rejects files over 30 MB", () => expect(validateAudioFile({ name: "song.mp3", type: "audio/mpeg", size: 31 * 1024 * 1024 })).not.toBeNull());
  it("rejects non-audio files", () => expect(validateAudioFile({ name: "photo.jpg", type: "image/jpeg", size: 1000 })).not.toBeNull());
  it("only accepts https links", () => {
    expect(validateAudioUrl("https://example.com/a.mp3")).toBeNull();
    expect(validateAudioUrl("http://example.com/a.mp3")).not.toBeNull();
  });
});
