CREATE TABLE public.playlist_editors (
  email text PRIMARY KEY CHECK (email = lower(email))
);
GRANT ALL ON public.playlist_editors TO service_role;
ALTER TABLE public.playlist_editors ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_playlist_editor()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.playlist_editors
    WHERE email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;
REVOKE ALL ON FUNCTION public.is_playlist_editor() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_playlist_editor() TO anon, authenticated;

CREATE TABLE public.playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL,
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
  artist text CHECK (artist IS NULL OR char_length(artist) <= 200),
  audio_url text CHECK (audio_url IS NULL OR audio_url ~ '^(https://|/__l5e/assets-v1/)'),
  storage_path text,
  track_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.playlist_tracks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playlist_tracks TO authenticated;
GRANT ALL ON public.playlist_tracks TO service_role;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view the playlist" ON public.playlist_tracks
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors can add songs" ON public.playlist_tracks
  FOR INSERT TO authenticated WITH CHECK (public.is_playlist_editor());
CREATE POLICY "Editors can edit songs" ON public.playlist_tracks
  FOR UPDATE TO authenticated USING (public.is_playlist_editor()) WITH CHECK (public.is_playlist_editor());
CREATE POLICY "Editors can remove songs" ON public.playlist_tracks
  FOR DELETE TO authenticated USING (public.is_playlist_editor());

CREATE OR REPLACE FUNCTION public.playlist_tracks_guard()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.track_key := OLD.track_key; -- special keys can never be changed from the app
  ELSIF TG_OP = 'INSERT' AND auth.uid() IS NOT NULL THEN
    NEW.track_key := NULL; -- only the original seed rows carry keys
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER playlist_tracks_guard BEFORE INSERT OR UPDATE ON public.playlist_tracks
  FOR EACH ROW EXECUTE FUNCTION public.playlist_tracks_guard();

INSERT INTO public.playlist_tracks (position, title, artist, audio_url, track_key) VALUES
(1, 'Teri Jhalak', NULL, '/__l5e/assets-v1/29e3dff1-f6b0-4dc5-8c07-5c2555b186da/teri-jhalak.mp3', 'teri-jhalak'),
(2, 'Dua', NULL, '/__l5e/assets-v1/d1be5154-1e7f-43e6-b399-1bffe5a8df81/dua.mp3', 'dua'),
(3, 'Dekho Na', NULL, '/__l5e/assets-v1/f5de3413-accd-459b-882d-b0ee894a9428/dekho-na.mp3', 'dekho-na'),
(4, 'Fear', NULL, NULL, 'fear'),
(5, 'Meri Banogi Kya', NULL, '/__l5e/assets-v1/116ae056-8440-4386-805e-a44e9d3ee8f8/meri-banogi-kya.mp3', 'meri-banogi-kya'),
(6, 'Naino Ne Baandhi', NULL, '/__l5e/assets-v1/8e54bc9c-1e43-430a-9e7a-373482091eb9/naino-ne-baandhi.mp3', 'naino-ne-baandhi'),
(7, 'Qayde Se', NULL, NULL, 'qayde-se'),
(8, 'Haara', NULL, NULL, 'haara'),
(9, 'Door', NULL, NULL, 'door'),
(10, 'Jaana Nahi', NULL, NULL, 'jaana-nahi'),
(11, 'Tu Hai Jahan', NULL, NULL, 'tu-hai-jahan'),
(12, 'Hope', NULL, NULL, 'hope'),
(13, 'Until I Found You', NULL, '/__l5e/assets-v1/9ad26c86-eb6c-4b71-b911-fca432d81056/until-i-found-you.mp3', 'until-i-found-you'),
(14, 'Kaafi Hai Na', NULL, NULL, 'kaafi-hai-na'),
(15, 'Sang Chalogi Kya', NULL, '/__l5e/assets-v1/ea2fb8bb-1f56-4449-820e-a9472d58f9f2/sang-chalogi-kya.mp3', 'sang-chalogi-kya'),
(16, 'Tera Naam Doon', NULL, NULL, 'tera-naam-doon'),
(17, 'Piya O''re Piya', NULL, NULL, 'piya-ore-piya'),
(18, 'Tere Sang Yaara', NULL, NULL, 'tere-sang-yaara'),
(19, 'Sirf Tum', 'Darshan Raval', '/__l5e/assets-v1/60c9c8de-ab9b-4bdf-8a67-9b0550faa16c/sirf-tum.mp3', 'sirf-tum'),
(20, 'Tum Mere', NULL, NULL, 'tum-mere'),
(21, 'Mila Tujhe', NULL, NULL, 'mila-tujhe'),
(22, 'Mai Tujhsa Hogaya', NULL, NULL, 'mai-tujhsa-hogaya'),
(23, 'Baawra', NULL, NULL, 'baawra'),
(24, 'Halka Halka', NULL, NULL, 'halka-halka'),
(25, 'Tujhko', NULL, NULL, 'tujhko'),
(26, 'Mausam', NULL, NULL, 'mausam'),
(27, 'Darmiyaan Unplugged', NULL, NULL, 'darmiyaan-unplugged'),
(28, 'Laute Nahi', NULL, NULL, 'laute-nahi'),
(29, 'Aur Mohabbat Kitni Karoon', NULL, NULL, 'aur-mohabbat-kitni-karoon'),
(30, 'Das Haasil Sau Baaki', NULL, NULL, 'das-haasil-sau-baaki'),
(31, 'Jab Tak Hai Jaan Title Song', NULL, NULL, 'jab-tak-hai-jaan-title-song'),
(32, 'Hote Tak', 'Papon', '/__l5e/assets-v1/c8eb50a8-bcac-4cce-8c90-d3d366e65648/hote-tak.mp3', 'hote-tak');

CREATE POLICY "Anyone can listen to playlist audio" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'playlist-audio');
CREATE POLICY "Editors can upload playlist audio" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'playlist-audio' AND public.is_playlist_editor());
CREATE POLICY "Editors can replace playlist audio" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'playlist-audio' AND public.is_playlist_editor());
CREATE POLICY "Editors can delete playlist audio" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'playlist-audio' AND public.is_playlist_editor());