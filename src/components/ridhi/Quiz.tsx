import { useEffect, useState } from "react";
import { QUIZ, RATING_LABELS } from "@/data/quiz";

type Answer = { choice?: number; text?: string };
const KEY = "ridhi-quiz-v1";

export function Quiz() {
  const [step, setStep] = useState(-1); // -1 intro, 0..24 questions, 25 rating, 26 done
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s) { setAnswers(s.answers || {}); setRating(s.rating || 0); setFeedback(s.feedback || ""); } } catch { /* ignore */ }
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify({ answers, rating, feedback })); }, [answers, rating, feedback]);

  const set = (i: number, a: Answer) => setAnswers((p) => ({ ...p, [i]: { ...p[i], ...a } }));

  if (step === -1) {
    return (
      <div className="text-center">
        <button className="btn-soft" onClick={() => setStep(0)}>Let's begin ♡</button>
      </div>
    );
  }

  if (step === 25) {
    return (
      <div className="animate-fade-up mx-auto max-w-xl space-y-6 rounded-[2rem] bg-card p-8 text-center shadow-soft">
        <h3 className="text-3xl md:text-4xl">How was your little experience? ♡</h3>
        <p className="text-muted-foreground">Rate your experience, from your honest thoughts to your overall vibe. 👀</p>
        <div role="radiogroup" aria-label="Experience rating" className="flex justify-center gap-2">
          {RATING_LABELS.map((label, i) => (
            <button key={i} role="radio" aria-checked={rating === i + 1} aria-label={`${i + 1} — ${label}`}
              onClick={() => setRating(rating === i + 1 ? 0 : i + 1)}
              className={`text-4xl transition-transform hover:scale-110 ${i < rating ? "text-rose" : "text-border"}`}>♥</button>
          ))}
        </div>
        <p className="min-h-6 font-serif text-xl italic text-heading">{rating ? RATING_LABELS[rating - 1] : ""}</p>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Anything you want to tell me? 💌" rows={4}
          className="w-full rounded-2xl border border-input bg-background p-4 outline-none focus:ring-2 focus:ring-ring" />
        <div className="flex justify-between gap-3">
          <button className="btn-ghost" onClick={() => setStep(24)}>← Back</button>
          <button className="btn-soft" onClick={() => setStep(26)}>Finish</button>
        </div>
      </div>
    );
  }

  if (step === 26) {
    return (
      <div className="animate-zoom-in mx-auto max-w-xl space-y-4 rounded-[2rem] bg-card p-10 text-center shadow-soft">
        <p className="text-5xl">🎀</p>
        <h3 className="text-3xl md:text-4xl">All done, Ridhi ♡</h3>
        <p className="text-muted-foreground">Your answers are saved on this device only — they haven't been sent anywhere.</p>
        <button className="btn-ghost" onClick={() => setStep(0)}>Look through my answers</button>
      </div>
    );
  }

  const q = QUIZ[step];
  const a = answers[step] || {};
  const sel = a.choice !== undefined ? q.options?.[a.choice] : undefined;

  return (
    <div key={step} className="animate-fade-up mx-auto max-w-2xl rounded-[2rem] bg-card p-6 shadow-soft md:p-10">
      <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {step + 1} of 25</span>
      </div>
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-rose transition-all duration-500" style={{ width: `${((step + 1) / 25) * 100}%` }} />
      </div>
      <h3 className="mb-6 text-2xl md:text-3xl">{q.q}</h3>

      {q.options && (
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const active = a.choice === i;
            return (
              <button key={i} onClick={() => set(step, { choice: i })} aria-pressed={active}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition-all ${active ? "border-rose bg-accent text-heading shadow-soft" : "border-border bg-background hover:border-sky"}`}>
                {opt.label}
              </button>
            );
          })}
          {sel?.input && (
            <textarea value={a.text || ""} onChange={(e) => set(step, { text: e.target.value })} placeholder={sel.input}
              rows={sel.input.length > 60 ? 5 : 2} className="animate-fade-up w-full rounded-2xl border border-input bg-background p-4 outline-none focus:ring-2 focus:ring-ring" />
          )}
        </div>
      )}
      {q.text && (
        <textarea value={a.text || ""} onChange={(e) => set(step, { text: e.target.value })} placeholder={q.text.hint} rows={4}
          className="w-full rounded-2xl border border-input bg-background p-4 outline-none focus:ring-2 focus:ring-ring" />
      )}

      <div className="sticky bottom-3 mt-8 flex justify-between gap-3">
        <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
        <button className="btn-soft" onClick={() => setStep(step + 1)}>Next →</button>
      </div>
    </div>
  );
}
