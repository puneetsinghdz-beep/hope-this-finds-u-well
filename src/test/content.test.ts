import { describe, expect, it } from "vitest";
import { QUIZ, RATING_LABELS } from "@/data/quiz";
import { PLAYLIST } from "@/data/playlist";

describe("approved content", () => {
  it("has exactly 25 quiz questions", () => expect(QUIZ).toHaveLength(25));
  it("has five rating levels", () => expect(RATING_LABELS).toHaveLength(5));
  it("has 32 tracks starting with Teri Jhalak and ending with Hote Tak", () => {
    expect(PLAYLIST).toHaveLength(32);
    expect(PLAYLIST[0].title).toBe("Teri Jhalak");
    expect(PLAYLIST[31].title).toBe("Hote Tak");
  });
});
