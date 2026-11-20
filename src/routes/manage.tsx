import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SignIn } from "@/components/manage/SignIn";
import { useIsEditor, useSession } from "@/lib/editor";
import { ManagePlaylist } from "@/components/manage/ManagePlaylist";

export const Route = createFileRoute("/manage")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Manage Playlist — The Ridhi Experience ♡" },
      { name: "description", content: "Playlist editing for Puneet and Ridhi." },
      { property: "og:title", content: "Manage Playlist — The Ridhi Experience ♡" },
      { property: "og:description", content: "Playlist editing for Puneet and Ridhi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ManagePage,
});

function ManagePage() {
  const session = useSession();
  const isEditor = useIsEditor();
  const signOut = async () => { await supabase.auth.signOut(); };
  return (
    <main className="bg-wash min-h-screen px-5 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-heading">← The Ridhi Experience ♡</Link>
          <h1 className="mt-4 text-4xl md:text-5xl">Manage Playlist</h1>
          {session && <p className="mt-3 text-sm text-muted-foreground">Signed in as {session.user.email} · <button className="underline underline-offset-4" onClick={signOut}>Sign out</button></p>}
        </div>
        {session === undefined ? null : !session ? <SignIn returnTo="/manage" /> : isEditor === undefined ? (
          <p className="text-center text-muted-foreground">Checking access…</p>
        ) : isEditor ? <ManagePlaylist /> : (
          <p className="text-center text-muted-foreground">This account isn't allowed to edit the playlist.</p>
        )}
      </div>
    </main>
  );
}
