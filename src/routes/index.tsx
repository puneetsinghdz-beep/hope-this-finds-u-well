import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home } from "@/components/ridhi/Home";
import { Story } from "@/components/ridhi/Story";
import { pauseAudio } from "@/lib/audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Ridhi Experience ♡" },
      { name: "description", content: "A little something, made just for you… ♡" },
      { property: "og:title", content: "The Ridhi Experience ♡" },
      { property: "og:description", content: "A little corner for you, hope it matches your vibe" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [home, setHome] = useState(false);
  const [run, setRun] = useState(0); // bumping this remounts the story so every step and animation starts fresh
  const replay = () => { pauseAudio(); window.scrollTo({ top: 0 }); setRun((r) => r + 1); setHome(false); };
  const done = () => { window.scrollTo({ top: 0 }); setHome(true); };
  return home ? <Home onReplay={replay} /> : <Story key={run} onDone={done} />;
}
