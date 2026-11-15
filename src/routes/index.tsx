import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home } from "@/components/ridhi/Home";
import { Story } from "@/components/ridhi/Story";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Ridhi Experience ♡" },
      { name: "description", content: "A little something, made just for you… ♡" },
      { property: "og:title", content: "The Ridhi Experience ♡" },
      { property: "og:description", content: "A little collection of wishes, memories, chaos, and surprises." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [home, setHome] = useState(false);
  return home ? <Home /> : <Story onDone={() => setHome(true)} />;
}
