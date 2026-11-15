# The Ridhi Experience ♡ — Build Plan

A cinematic, one-person birthday gift site built from your master brief, using the 9 uploaded photos and exact approved wording only.

## Story flow (one continuous experience at /)
```text
Envelope -> Birthday celebration -> Ethnic Era -> Chat with Puneet -> Pose Investigation -> Hope u like it -> Homepage
```
1. **Envelope** — "A little something, made just for you… ♡", tap to open, gentle animation. No autoplay.
2. **Birthday celebration** — confetti, floating decorations, black-outfit balloon photo as focal image; exact heading and three lines of text.
3. **Ethnic Era** — exact heading; editorial collage of yellow doorway (feature), gold gown, floral mirror selfie, peach mirror selfie.
4. **Chat** — DM-style screen, sender "Puneet"; message 1, typing dots, message 2, then "Okay, I don't 😊".
5. **Pose Investigation** — exact heading; waterfall -> geometric frame -> wooden seating -> white sweater, one by one, then a playful collage with "Different day. Different moment. Same pose. 😭".
6. **Closing** — black-outfit photo, "Hope u like it ♡", "See what comes next →".

## Homepage (exactly three sections)
- Heading "The Ridhi Experience ♡" + approved supporting line.
- **Birthday Wishes for Ridhi** — photo slideshow with Previous / Next / Replay Story.
- **The Little Things That Make You, You ♡** — the locked 25-question quiz, exact wording, order, options and emojis as you pasted it; one question at a time, "Question X of 25", write-in fields, skips only where approved (Q13, Q14 etc.), answers kept when going back. No score or ranking. Answers stay on her device only.
- **Separate rating page after Q25** (not Question 26, not counted in the 25): "How was your little experience? ♡", "Rate your experience, from your honest thoughts to your overall vibe. 👀", five selectable hearts — 1 Not really my vibe, 2 It was okay, 3 Pretty nice, 4 Loved it, 5 Made me smile so much ♡ — optional feedback field "Anything you want to tell me? 💌", and a "Finish" button. Both optional. The final completion screen comes after this page.
- **A song for you 🎶** — vinyl-style player, 32 tracks in exact order, play/pause, prev/next, seek, times, volume, shuffle (keeps default order intact), repeat, playlist highlighting, Hote Tak — Papon button "Now you know the song. Want to know why I chose it? ♡" shown only after the song naturally ends, explanation revealed only on click (hidden again when another track is picked), simple song-suggestion field (no fake "sent" claim).
- Subtle "Before you go…" link opening the exact, unchanged secret letter only on click. The letter is never used anywhere else.

## Preserved as approved
Envelope, birthday celebration, Ethnic Era, Puneet chat, Pose Investigation, heartfelt closing, homepage with exactly three sections, optional secret letter, and all approved wording and interactions — nothing removed or replaced.

## Design
Palette exactly as specified (#F4FAFF, #B9DDF5, #DCEEFF, #F6DCE8, #EBAFC7, #253B53, #34465A). Elegant serif headings (Cormorant Garamond) with italic accents, clean sans body (Karla). Soft shadows, rounded corners, delicate hearts/sparkles, reduced-motion respected, mobile-first responsive. No visible photo descriptions, labels, or chapter numbers.

## Pending items (will not be invented)
- **Songs**: player and full playlist built now; each track shows as unavailable until you upload the 32 MP3s. Next step: upload the MP3s (or ZIP) and I'll connect them.
- **Birthday Wishes slide messages**: the master brief and project were searched; no approved slide messages exist in either. Slides will use only the uploaded photos, with message content left pending (nothing invented) until you send the exact wording.
- **Hote Tak explanation**: not found in the brief or project. The button and reveal flow will work; only the message itself stays pending.

## Technical details
- Photos uploaded via Lovable Assets; pointers in src/assets.
- Story state machine in one route component; homepage sections as separate components; playlist manifest in a data file (title, filename, available flag).
- Single shared HTMLAudioElement to prevent overlap; `ended` event drives autoplay-next and the Hote Tak reveal.
- Quiz data stored verbatim in a data file; answers in local state/localStorage only. No backend.
- Head metadata on / with unique title/description.
