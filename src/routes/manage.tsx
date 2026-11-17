import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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

function SignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/manage` } });
    setBusy(false);
    if (res.error) setMsg(res.error.message);
    else if (mode === "up" && !res.data.session) setMsg("Check your email to confirm your account, then sign in.");
  };
  const google = async () => {
    setMsg(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/manage` });
    if (r.error) setMsg("Google sign-in didn't work. Please try again.");
  };
  const field = "w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="mx-auto max-w-sm space-y-5 rounded-[1.5rem] bg-card p-7 shadow-soft">
      <button type="button" onClick={google} className="flex w-full items-center justify-center gap-2.5 rounded-full border border-border bg-card px-3 py-2.5 text-sm font-medium text-heading">
        <svg aria-hidden="true" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.470c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.760 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
        Continue with Google
      </button>
      <p className="text-center text-xs text-muted-foreground">or</p>
      <form onSubmit={submit} className="space-y-3">
        <input className={field} type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={field} type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} placeholder="Password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
        <button type="submit" className="btn-soft w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</button>
      </form>
      <button type="button" className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }}>
        {mode === "in" ? "No account yet? Create one" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

function ManagePage() {
  const session = useSession();
  const isEditor = useIsEditor();
  const [checked, setChecked] = useState(false);
  useEffect(() => { setChecked(false); if (session) { const t = setTimeout(() => setChecked(true), 1500); return () => clearTimeout(t); } }, [session]);
  const signOut = async () => { await supabase.auth.signOut(); };
  return (
    <main className="bg-wash min-h-screen px-5 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-heading">← The Ridhi Experience ♡</Link>
          <h1 className="mt-4 text-4xl md:text-5xl">Manage Playlist</h1>
          {session && <p className="mt-3 text-sm text-muted-foreground">Signed in as {session.user.email} · <button className="underline underline-offset-4" onClick={signOut}>Sign out</button></p>}
        </div>
        {session === undefined ? null : !session ? <SignIn /> : isEditor ? <ManagePlaylist /> : checked ? (
          <p className="text-center text-muted-foreground">This account isn't allowed to edit the playlist.</p>
        ) : <p className="text-center text-muted-foreground">Checking access…</p>}
      </div>
    </main>
  );
}
