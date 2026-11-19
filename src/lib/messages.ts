import { supabase } from "@/integrations/supabase/client";

export const MAX_MESSAGE = 4000;

/** Returns an error message, or null when the text can be sent. */
export function validateMessage(text: string): string | null {
  const t = text.trim();
  if (!t) return "Write a little something first ♡";
  if (t.length > MAX_MESSAGE) return `That's a bit long — please keep it under ${MAX_MESSAGE} characters.`;
  return null;
}

/** Saves privately. Visitors can add but never read; resolves only when the backend confirms. */
export async function sendPrivateMessage(text: string) {
  const { error } = await supabase.from("private_messages").insert({ body: text.trim() });
  if (error) throw new Error("not saved");
}

export async function listPrivateMessages() {
  const { data, error } = await supabase.from("private_messages").select("id, body, created_at").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
