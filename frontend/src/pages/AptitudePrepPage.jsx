import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { askMentor } from "../api/client";

const questionBank = {
  Quantitative: [
    {
      question: "If a train travels 120 km in 2 hours, what is its speed?",
      options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
      answer: 1,
    },
    {
      question: "What is 25% of 320?",
      options: ["60", "70", "80", "90"],
      answer: 2,
    },
  ],
  "Logical Reasoning": [
    {
      question: "Find the next term: 2, 6, 12, 20, ?",
      options: ["28", "30", "32", "34"],
      answer: 1,
    },
    {
      question: "If all roses are flowers and some flowers fade quickly, which is true?",
      options: [
        "All roses fade quickly",
        "Some roses may fade quickly",
        "No roses fade quickly",
        "None of these",
      ],
      answer: 1,
    },
  ],
  "Verbal Ability": [
    {
      question: "Choose the correct synonym of 'Abundant'.",
      options: ["Scarce", "Plentiful", "Rare", "Weak"],
      answer: 1,
    },
    {
      question: "Identify the grammatically correct sentence.",
      options: [
        "She do not like coffee.",
        "She does not likes coffee.",
        "She does not like coffee.",
        "She not like coffee.",
      ],
      answer: 2,
    },
  ],
};

const tracks = Object.keys(questionBank);

export default function AptitudePrepPage() {
  const [track, setTrack] = useState(tracks[0]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingTips, setLoadingTips] = useState(false);
  const [tips, setTips] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const questions = questionBank[track];
  const score = useMemo(() => {
    const correct = questions.reduce(
      (count, q, idx) => (answers[idx] === q.answer ? count + 1 : count),
      0
    );
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const submitQuiz = async () => {
    setSubmitted(true);
    setShowAnswers(true);
    setLoadingTips(true);
    setTips("");
    const prompt = `Give a 7-day ${track} aptitude improvement plan.
Current score: ${score}/100.
Give:
1) 3 weak-area drills
2) Daily plan
3) Time-management tips
4) 5 practice resources`;
    try {
      const reply = await askMentor(prompt);
      setTips(reply);
    } catch {
      setTips("Unable to fetch AI tips now. Retry in a moment.");
    } finally {
      setLoadingTips(false);
    }
  };

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Aptitude Prep</h1>
          <p className="text-sm text-[var(--muted)]">
            Quant, reasoning, and verbal practice tracks with instant score and AI guidance.
          </p>
          <select
            value={track}
            onChange={(e) => {
              setTrack(e.target.value);
              setAnswers({});
              setSubmitted(false);
              setTips("");
            }}
            className="mt-4 rounded-xl border border-white/30 bg-white/65 px-3 py-3 dark:bg-white/5"
          >
            {tracks.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="glass-card rounded-3xl p-6">
          {questions.map((q, idx) => (
            <div key={q.question} className="mb-4 rounded-2xl border border-white/25 bg-white/55 p-4 dark:bg-white/5">
              <p className="font-semibold">
                {idx + 1}. {q.question}
              </p>
              <div className="mt-2 space-y-2">
                {q.options.map((option, optIdx) => (
                  <label key={option} className="flex cursor-pointer items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm dark:bg-white/10">
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      checked={answers[idx] === optIdx}
                      onChange={() => setAnswers((prev) => ({ ...prev, [idx]: optIdx }))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={submitQuiz}
            className="rounded-xl bg-[var(--brand)] px-5 py-3 font-semibold text-white"
          >
            Submit Quiz
          </button>
        </div>

        {submitted && (
          <div className="glass-card rounded-3xl p-6">
            <p className="font-heading text-xl font-semibold">Aptitude Result</p>
            <p className="mt-2 text-sm">
              Current Score: <strong>{score}/100</strong>
            </p>
            {showAnswers && (
              <div className="mt-4 space-y-2">
                <p className="font-semibold">Answer Key</p>
                {questions.map((q, idx) => {
                  const userIdx = answers[idx];
                  const correctIdx = q.answer;
                  const isCorrect = userIdx === correctIdx;
                  return (
                    <div
                      key={`${q.question}-ans`}
                      className={`rounded-xl border px-3 py-2 text-sm ${
                        isCorrect
                          ? "border-emerald-400/40 bg-emerald-500/10"
                          : "border-amber-400/40 bg-amber-500/10"
                      }`}
                    >
                      <p className="font-medium">{idx + 1}. {q.question}</p>
                      <p className="mt-1 text-xs">
                        Your answer:{" "}
                        <span className="font-semibold">
                          {typeof userIdx === "number" ? q.options[userIdx] : "Not answered"}
                        </span>
                      </p>
                      <p className="text-xs">
                        Correct answer: <span className="font-semibold">{q.options[correctIdx]}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 rounded-2xl border border-white/25 bg-white/55 p-4 text-sm dark:bg-white/10">
              <p className="font-semibold">AI Improvement Plan</p>
              {loadingTips ? (
                <p className="mt-2 text-[var(--muted)]">Generating your personalized aptitude plan...</p>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-[var(--muted)]">{tips || "No tips yet."}</p>
              )}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
