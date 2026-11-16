import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Current sign-in session (browser only). `undefined` while loading. */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data: d }) => setSession(d.session));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}

/** Whether the signed-in person is on the playlist editors list (checked by the backend). */
export function useIsEditor() {
  const session = useSession();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!session) { setOk(false); return; }
    let live = true;
    supabase.rpc("is_playlist_editor").then(({ data }) => { if (live) setOk(data === true); });
    return () => { live = false; };
  }, [session?.user.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return ok;
}
