<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- All audio goes through the single shared element in `src/lib/audio.ts` (with an `owner`); never create another `<audio>` — prevents overlapping songs and keeps vinyl/effects tied to real playback.
- The shared playlist lives in the `playlist_tracks` table; `src/data/playlist.ts` is the seeded reference + offline fallback. Special behaviour (default track, recommendation, Hote Tak) keys off `track_key`, which the DB trigger makes immutable — renaming a song must never break those interactions.
- Playlist write access = signed-in email listed in `playlist_editors` (checked by `is_playlist_editor()` in RLS and storage policies). Keep email confirmation on, otherwise anyone could claim an editor's email.
- Uploaded audio lives in the private `playlist-audio` bucket under `tracks/` and is played via signed URLs (public buckets are blocked in this workspace); only `tracks/` files may be deleted, original songs are CDN assets.
- Quiz answers, ratings and the song-suggestion/message notes stay in localStorage only and must never claim to be sent.
- The letter gate stores only a SHA-256 hash of the code (playful gate, not security).
