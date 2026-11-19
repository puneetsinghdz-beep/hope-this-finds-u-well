import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EXTRA_TRACKS, PLAYLIST } from "@/data/playlist";

export type PlayTrack = {
  id: string; // stable id used by the player: the original key for the 32 originals, row id for added songs
  rowId: string | null;
  key: string | null;
  position: number;
  title: string;
  artist: string | null;
  audioUrl: string | null;
  storagePath: string | null;
  src: string | null; // playable source, null = unavailable
};

export const AUDIO_BUCKET = "playlist-audio";

export const FALLBACK_TRACKS: PlayTrack[] = [...PLAYLIST, ...EXTRA_TRACKS].map((t, i) => ({
  id: t.key, rowId: null, key: t.key, position: i + 1, title: t.title, artist: t.artist ?? null,
  audioUrl: t.file ?? null, storagePath: null, src: t.file ?? null,
}));

async function fetchTracks(): Promise<PlayTrack[]> {
  const { data, error } = await supabase
    .from("playlist_tracks")
    .select("id, position, title, artist, audio_url, storage_path, track_key, created_at")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  const paths = data.flatMap((r) => (r.storage_path ? [r.storage_path] : []));
  const signed: Record<string, string> = {};
  if (paths.length) {
    const { data: s } = await supabase.storage.from(AUDIO_BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
    s?.forEach((x) => { if (x.path && x.signedUrl) signed[x.path] = x.signedUrl; });
  }
  return data.map((r) => ({
    id: r.track_key ?? r.id, rowId: r.id, key: r.track_key, position: r.position, title: r.title, artist: r.artist,
    audioUrl: r.audio_url, storagePath: r.storage_path,
    src: r.storage_path ? (signed[r.storage_path] ?? null) : r.audio_url,
  }));
}

export const tracksQuery = queryOptions({ queryKey: ["playlist"], queryFn: fetchTracks, staleTime: 60_000 });

/** Shared playlist from the backend; shows the approved built-in list until it loads (or if it can't). */
export function useTracks() {
  const q = useQuery(tracksQuery);
  return q.data ?? FALLBACK_TRACKS;
}
