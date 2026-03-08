import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { mockInterviewQuestions } from "../data/careerExplorerData";
import { askMentor } from "../api/client";

const roles = Object.keys(mockInterviewQuestions);

export default function AIMockInterviewPage() {
  const [role, setRole] = useState(roles[0]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [sampleAnswers, setSampleAnswers] = useState("");

  const questions = mockInterviewQuestions[role];
  const confidence = useMemo(() => {
    const lengths = Object.values(answers).map((v) => (v || "").trim().length);
    if (!lengths.length) return 0;
    return Math.min(100, Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length));
  }, [answers]);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">AI Mock Interview</h1>
          <p className="text-sm text-[var(--muted)]">
            Choose a role, answer technical prompts, and get confidence + improvement feedback.
          </p>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setAnswers({});
              setSubmitted(false);
              setAiFeedback("");
              setSampleAnswers("");
            }}
            className="mt-4 rounded-xl border border-white/30 bg-white/65 px-3 py-3 dark:bg-white/5"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="glass-card rounded-3xl p-6">
          {questions.map((question, idx) => (
            <div key={question} className="mb-4 rounded-2xl border border-white/25 bg-white/55 p-4 dark:bg-white/5">
              <p className="font-semibold">{idx + 1}. {question}</p>
              <textarea
                rows={4}
                value={answers[idx] || ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/25 bg-white/75 p-3 text-sm outline-none dark:bg-white/10"
                placeholder="Type your answer..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={async () => {
              setSubmitted(true);
              setLoadingFeedback(true);
              setAiFeedback("");
              setSampleAnswers("");
              const answerBundle = questions
                .map((question, idx) => `Q${idx + 1}: ${question}\nA: ${answers[idx] || "No answer"}`)
                .join("\n\n");
              const prompt = `Evaluate this ${role} mock interview.
Give:
1) Overall score out of 100
2) Top 3 strengths
3) Top 3 improvements
4) 5 practice actions for next 7 days

Interview responses:
${answerBundle}`;
              try {
                const response = await askMentor(prompt);
                setAiFeedback(response);
                const modelPrompt = `Provide concise model answers for these ${role} mock interview questions.
Return numbered answers matching each question, 3-5 lines each.

Questions:
${questions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")}`;
                const modelResponse = await askMentor(modelPrompt);
                setSampleAnswers(modelResponse);
              } catch {
                setAiFeedback("Unable to fetch AI feedback right now. Please try again.");
                setSampleAnswers("Unable to fetch sample answers right now.");
              } finally {
                setLoadingFeedback(false);
              }
            }}
            className="rounded-xl bg-[var(--brand)] px-5 py-3 font-semibold text-white"
          >
            Evaluate Answers
          </button>
        </div>

        {submitted && (
          <div className="glass-card rounded-3xl p-6">
            <p className="font-heading text-xl font-semibold">Interview Feedback</p>
            <p className="mt-2 text-sm">
              Confidence Score: <strong>{confidence}/100</strong>
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
              <li>Use STAR structure for scenario-based responses.</li>
              <li>Include metrics and tradeoffs in system/design answers.</li>
              <li>Conclude answers with clear business impact.</li>
            </ul>
            <div className="mt-4 rounded-2xl border border-white/25 bg-white/55 p-4 text-sm dark:bg-white/10">
              <p className="font-semibold">AI Detailed Review</p>
              {loadingFeedback ? (
                <p className="mt-2 text-[var(--muted)]">Analyzing your interview responses...</p>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-[var(--muted)]">{aiFeedback || "No feedback yet."}</p>
              )}
            </div>
            <div className="mt-4 rounded-2xl border border-white/25 bg-white/55 p-4 text-sm dark:bg-white/10">
              <p className="font-semibold">Suggested Answers</p>
              {loadingFeedback ? (
                <p className="mt-2 text-[var(--muted)]">Generating model answers...</p>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-[var(--muted)]">
                  {sampleAnswers || "No sample answers yet."}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
