CREATE TABLE public.site_owners (
  email text PRIMARY KEY CHECK (email = lower(email))
);
GRANT ALL ON public.site_owners TO service_role;
ALTER TABLE public.site_owners ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_site_owner()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.site_owners
    WHERE email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;
REVOKE ALL ON FUNCTION public.is_site_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_site_owner() TO anon, authenticated;

CREATE TABLE public.private_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.private_messages TO anon, authenticated;
GRANT SELECT, DELETE ON public.private_messages TO authenticated;
GRANT ALL ON public.private_messages TO service_role;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can leave a private message" ON public.private_messages
  FOR INSERT TO anon, authenticated WITH CHECK (char_length(btrim(body)) BETWEEN 1 AND 4000);
CREATE POLICY "Only the owner can read messages" ON public.private_messages
  FOR SELECT TO authenticated USING (public.is_site_owner());
CREATE POLICY "Only the owner can delete messages" ON public.private_messages
  FOR DELETE TO authenticated USING (public.is_site_owner());