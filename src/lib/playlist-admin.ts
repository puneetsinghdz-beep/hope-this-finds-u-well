import { supabase } from "@/integrations/supabase/client";
import { AUDIO_BUCKET, type PlayTrack } from "@/lib/tracks";

export const MAX_AUDIO_BYTES = 30 * 1024 * 1024;
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/wav", "audio/x-wav", "audio/webm"];
const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|oga|wav|webm)$/i;

/** Returns an error message, or null when the file is an acceptable audio upload. */
export function validateAudioFile(file: { name: string; type: string; size: number }): string | null {
  if (!(AUDIO_TYPES.includes(file.type) || (!file.type && AUDIO_EXT.test(file.name))) || !AUDIO_EXT.test(file.name))
    return "Please choose an audio file (MP3, M4A, AAC, OGG, WAV or WEBM).";
  if (file.size > MAX_AUDIO_BYTES) return "That file is larger than 30 MB.";
  if (file.size === 0) return "That file is empty.";
  return null;
}

/** Returns an error message, or null for a usable https audio link. Empty is allowed (song stays unavailable). */
export function validateAudioUrl(url: string): string | null {
  if (!url.trim()) return null;
  try { const u = new URL(url.trim()); return u.protocol === "https:" ? null : "The link must start with https://"; }
  catch { return "That doesn't look like a valid link."; }
}

export type AudioChoice = { kind: "keep" } | { kind: "none" } | { kind: "url"; url: string } | { kind: "file"; file: File };

async function upload(file: File) {
  const ext = file.name.split(".").pop()!.toLowerCase();
  const path = `tracks/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(AUDIO_BUCKET).upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

// Only files this tool uploaded live in the bucket; the original songs are separate and never deleted here.
async function removeUploaded(path: string | null) {
  if (path?.startsWith("tracks/")) await supabase.storage.from(AUDIO_BUCKET).remove([path]);
}

async function audioFields(choice: AudioChoice): Promise<{ audio_url?: string | null; storage_path?: string | null }> {
  if (choice.kind === "keep") return {};
  if (choice.kind === "none") return { audio_url: null, storage_path: null };
  if (choice.kind === "url") return { audio_url: choice.url.trim() || null, storage_path: null };
  return { audio_url: null, storage_path: await upload(choice.file) };
}

export async function addTrack(input: { title: string; artist: string; audio: AudioChoice }, nextPosition: number) {
  const fields = await audioFields(input.audio);
  const { data, error } = await supabase.from("playlist_tracks")
    .insert({ title: input.title.trim(), artist: input.artist.trim() || null, position: nextPosition, ...fields })
    .select("id").single();
  if (error || !data) { await removeUploaded(fields.storage_path ?? null); throw new Error(error?.message ?? "The song wasn't saved."); }
}

export async function updateTrack(t: PlayTrack, input: { title: string; artist: string; audio: AudioChoice }) {
  const fields = await audioFields(input.audio);
  const { data, error } = await supabase.from("playlist_tracks")
    .update({ title: input.title.trim(), artist: input.artist.trim() || null, ...fields })
    .eq("id", t.rowId!).select("id");
  if (error || !data?.length) { await removeUploaded(fields.storage_path ?? null); throw new Error(error?.message ?? "You don't have permission to change this song."); }
  if ("storage_path" in fields && fields.storage_path !== t.storagePath) await removeUploaded(t.storagePath);
}

export async function deleteTrack(t: PlayTrack) {
  const { data, error } = await supabase.from("playlist_tracks").delete().eq("id", t.rowId!).select("id");
  if (error || !data?.length) throw new Error(error?.message ?? "You don't have permission to remove this song.");
  await removeUploaded(t.storagePath);
}

export async function swapPositions(a: PlayTrack, b: PlayTrack) {
  const r1 = await supabase.from("playlist_tracks").update({ position: b.position }).eq("id", a.rowId!).select("id");
  const r2 = await supabase.from("playlist_tracks").update({ position: a.position }).eq("id", b.rowId!).select("id");
  if (r1.error || r2.error || !r1.data?.length || !r2.data?.length) throw new Error("The new order wasn't saved.");
}
