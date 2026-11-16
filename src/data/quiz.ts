// LOCKED approved quiz. Do not rewrite, reorder or edit any wording.
export type QuizOption = { label: string; input?: string };
export type QuizQuestion = {
  q: string;
  options?: QuizOption[];
  text?: { hint: string };
};

const OTHER: QuizOption = { label: "Other (write your own) ✍️", input: "Write your own ✍️" };
const o = (...labels: string[]): QuizOption[] => labels.map((label) => ({ label }));

export const QUIZ: QuizQuestion[] = [
  { q: "What's your favourite food other than paneer? 👀", options: [...o("Anything but not paneer 😭", "Momos", "Mashroom", "Maggi"), OTHER] },
  { q: "Your favourite colour other than lavender 😂", options: [...o("Brown/ Beige", "Pink", "Red", "Sage green"), OTHER] },
  { q: "What's your all-time favourite food? 🍽️", options: [{ label: "Street Food (Drop the name)", input: "Drop the name" }, { label: "Authentic Meal (Drop the name)", input: "Drop the name" }, OTHER] },
  { q: "Your favourite sweet?", options: [...o("Rasmalai", "Kaju Katli", "Gulab Jamun 😭", "Jalebi 🌀"), OTHER] },
  { q: "Why don't you prefer pizza? 🍕", options: [...o("Teen kaune ka mooh hota hai isliye 😭", "Bas nhi pasand", "Pizza is overrated 💀"), OTHER] },
  { q: "What's your favourite song other than “Qafirana” and “Darkhast”? 🎧", text: { hint: "Write the song name and artist." } },
  { q: "Which song have you been playing the most recently? 🎶", text: { hint: "Write your answer." } },
  { q: "What's the last song you listened to? 👀", text: { hint: "Write your answer." } },
  { q: "Which show or movie are you watching right now? 📺", text: { hint: "Write your answer." } },
  { q: "How's your texting game is so good? 📱", options: [...o("Natural talent 😌", "Professional yapper 🗣️", "Depends on the person 👀", "Typing speed + drama 💀"), OTHER] },
  { q: "Pick your most dangerous late-night combination. 🌙", options: [...o("Music + overthinking 🎧", "Food + horror series 🍿", "Text + me 😭"), OTHER] },
  { q: "You promised me RASMALAI!!! but didn't completed WHENNN? 😭", options: [...o("Ohhh shitt, bhul gayi 💀", "Blinkit kr dungi, ruk", "A and B 😭"), OTHER] },
  { q: "If words and actions don't match, then… 👀", options: [...o("Trust the actions.", "Observe quietly.", "Ask directly.", "Step back."), OTHER, { label: "Skip this one." }] },
  { q: "What matters most to you in a friendship? 🤍", options: [...o("Honesty", "Consistency", "Understanding", "Communication"), OTHER, { label: "Skip this one." }] },
  { q: "What's your best birthday memory (what comes first when asked)?", text: { hint: "“Tell me the story. Even a small memory counts.”" } },
  { q: "Choose one according to your gut feeling. Don't overthink it. 👀", options: [...o("Aesthetic lamp 💡", "Flowers 💐", "Soft toys 🧸", "A dress 👗"), OTHER] },
  { q: "Which version of you deserves an award?", options: [...o("The one who handles everything in silence", "The one who remove expectations", "The one who survives difficult days 🤍", "The one nobody gets to see 👀"), OTHER] },
  { q: "What's harder for you?", options: [...o("Explaining feelings", "Pretending to be fine", "Trusting again", "Letting things go"), { label: "Other (write your own or all) ✍️", input: "Write your own or all ✍️" }] },
  { q: "What deserves a second chance? 🔁", options: [...o("An honest mistake", "A friendship that matters", "Someone showing real change", "Depends on what happened 👀"), OTHER] },
  { q: "What's one thing you've learned about yourself this year?", text: { hint: "“Anything. A big realisation, a tiny discovery, or a plot twist. 👀”" } },
  { q: "What thing would you change if you could go back to your past? 👀", options: [...o("Kuchh nhi, I never read books backward 🥱", "No regrets 😎", "I'd go back to sleep. Life was better before responsibilities 😭", "I'd fix my sleep schedule… actually, leave it 💀"), OTHER] },
  { q: "What upgrades are you expecting in your next-year update? 🎂🔮", options: [...o("Bas ek baar life meri side le le, baaki main sambhal lungi 😭", "A passport full of stamps and a camera roll full of memories ✈️🌍", "More confidence, better decisions, and absolutely zero unnecessary drama. 😌", "Financial independence, because adding things to cart is free but checkout isn't. 💀", "More spontaneous plans, crazy adventures, and stories I'll be laughing about for years. 😂"), { label: "Other (write your own plot twist) ✍️", input: "Write your own plot twist ✍️" }] },
  { q: "What's your childhood dream, and have you completed it—or do you still want to? 🥹", options: [{ label: "Kabhi itna socha hi nhi 😭" }, { label: "Writing section", input: "Think before you answer. Take your time and write whatever comes to mind. What did the little version of you dream of becoming or doing? Did that dream come true, change along the way, or is it still waiting for you?" }] },
  { q: "What's your favourite type of game?", options: [{ label: "Online games (name the game)", input: "Name the game" }, { label: "Physical games (name the game)", input: "Name the game" }, { label: "Skip this one" }] },
  { q: "Which one would you find the most interesting ?", options: [...o("Hide and Seek", "Baraf Paani", "Card-playing games", "Chor Sipahi", "Badminton"), { label: "Other (write your own)", input: "Write your own" }] },
];

export const RATING_LABELS = ["Not really my vibe", "It was okay", "Pretty nice", "Loved it", "Made me smile so much ♡"];
