import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsOwner, useSession } from "@/lib/editor";
import { listPrivateMessages } from "@/lib/messages";
import { SignIn } from "@/components/manage/SignIn";

export const Route = createFileRoute("/inbox")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Inbox — The Ridhi Experience ♡" },
      { name: "description", content: "Private messages, for the owner only." },
      { property: "og:title", content: "Inbox — The Ridhi Experience ♡" },
      { property: "og:description", content: "Private messages, for the owner only." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InboxPage,
});

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

function Messages() {
  const { data, isLoading, error } = useQuery({ queryKey: ["private-messages"], queryFn: listPrivateMessages });
  if (isLoading) return <p className="text-center text-muted-foreground">Loading messages…</p>;
  if (error || !data) return <p role="alert" className="text-center text-destructive">Messages couldn't be loaded. Please refresh.</p>;
  if (!data.length) return <p className="text-center text-muted-foreground">No messages yet.</p>;
  return (
    <ol className="space-y-4">
      {data.map((m) => (
        <li key={m.id} className="rounded-[1.5rem] bg-card p-6 shadow-soft">
          <p className="mb-2 text-xs text-muted-foreground">{when(m.created_at)}</p>
          <p className="whitespace-pre-line font-serif text-xl text-heading">{m.body}</p>
        </li>
      ))}
    </ol>
  );
}

function InboxPage() {
  const session = useSession();
  const isOwner = useIsOwner();
  return (
    <main className="bg-wash min-h-screen px-5 py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-heading">← The Ridhi Experience ♡</Link>
          <h1 className="mt-4 text-4xl md:text-5xl">Inbox 💌</h1>
          {session && <p className="mt-3 text-sm text-muted-foreground">Signed in as {session.user.email} · <button className="underline underline-offset-4" onClick={() => supabase.auth.signOut()}>Sign out</button></p>}
        </div>
        {session === undefined ? null : !session ? <SignIn returnTo="/inbox" /> : isOwner === undefined ? (
          <p className="text-center text-muted-foreground">Checking access…</p>
        ) : isOwner ? <Messages /> : (
          <p className="text-center text-muted-foreground">This account can't open the inbox.</p>
        )}
      </div>
    </main>
  );
}
