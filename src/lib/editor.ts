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

/** undefined while checking; whether the signed-in person is on the playlist editors list (checked by the backend). */
export function useIsEditor() { return useBackendCheck("is_playlist_editor"); }

/** undefined while checking; whether the signed-in person is the site owner who may read private messages. */
export function useIsOwner() { return useBackendCheck("is_site_owner"); }

function useBackendCheck(fn: "is_playlist_editor" | "is_site_owner") {
  const session = useSession();
  const [ok, setOk] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (session === undefined) return;
    if (!session) { setOk(false); return; }
    let live = true;
    setOk(undefined);
    supabase.rpc(fn).then(({ data }) => { if (live) setOk(data === true); });
    return () => { live = false; };
  }, [session?.user.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return ok;
}
