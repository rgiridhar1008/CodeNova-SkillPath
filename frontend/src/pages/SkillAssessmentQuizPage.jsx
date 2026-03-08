import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import Layout from "../components/Layout";
import { careerExplorerData, quizQuestions } from "../data/careerExplorerData";

const QUIZ_DURATION = 120;

export default function SkillAssessmentQuizPage() {
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) setSubmitted(true);
  }, [timeLeft, submitted]);

  const score = useMemo(() => {
    return quizQuestions.reduce((acc, q, idx) => (answers[idx] === q.answer ? acc + 1 : acc), 0);
  }, [answers]);

  const strengths = useMemo(() => {
    const map = {};
    quizQuestions.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        map[q.skill] = (map[q.skill] || 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [answers]);

  const recommended = useMemo(() => {
    const top = strengths[0]?.[0];
    if (!top) return ["Web Developer", "Data Scientist"];
    if (top === "AI") return ["AI Engineer", "Data Scientist"];
    if (top === "Web") return ["Web Developer", "Product Manager"];
    if (top === "Cloud") return ["Cloud Engineer", "AI Engineer"];
    if (top === "Security") return ["Cybersecurity Analyst", "Cloud Engineer"];
    return careerExplorerData.map((c) => c.name).slice(0, 2);
  }, [strengths]);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-bold">Skill Assessment Quiz</h1>
              <p className="text-sm text-[var(--muted)]">
                Timed MCQ assessment for strength/weakness profiling.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/65 px-4 py-2 dark:bg-white/10">
              <Clock3 size={16} />
              <span className="font-semibold">{Math.max(0, timeLeft)}s</span>
            </div>
          </div>
        </div>

        {!submitted ? (
          <div className="glass-card rounded-3xl p-6">
            <div className="space-y-5">
              {quizQuestions.map((q, idx) => (
                <article key={q.question} className="rounded-2xl border border-white/25 bg-white/50 p-4 dark:bg-white/5">
                  <p className="font-semibold">{idx + 1}. {q.question}</p>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {q.options.map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setAnswers((prev) => ({ ...prev, [idx]: option }))}
                        className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                          answers[idx] === option
                            ? "border-[var(--brand)] bg-[var(--brand)]/15"
                            : "border-white/25 bg-white/70 dark:bg-white/5"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <button
              onClick={() => setSubmitted(true)}
              className="mt-5 rounded-xl bg-[var(--brand)] px-5 py-3 font-semibold text-white"
            >
              Submit Assessment
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-6">
            <p className="font-heading text-2xl font-bold">Assessment Result</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Score: {score}/{quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)
            </p>
            <p className="mt-4 text-sm font-semibold">Strength Analysis</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {strengths.map(([skill, val]) => (
                <span key={skill} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold">
                  {skill} ({val})
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold">Recommended Careers</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recommended.map((role) => (
                <span key={role} className="rounded-full bg-[var(--brand)]/15 px-3 py-1 text-xs font-semibold">
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
