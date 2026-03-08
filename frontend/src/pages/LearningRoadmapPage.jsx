import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { generateRoadmap, getLearningResources } from "../api/client";

export default function LearningRoadmapPage() {
  const initialRoadmap = useMemo(() => {
    const raw = localStorage.getItem("skillpath_result");
    return raw ? JSON.parse(raw).roadmap : null;
  }, []);
  const [mode, setMode] = useState("topic");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [timeline, setTimeline] = useState("3 Months");
  const [role, setRole] = useState("Data Scientist");
  const [roleSkills, setRoleSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const roleOptions = ["Data Scientist", "Web Developer", "AI Engineer", "Cloud Engineer", "Cybersecurity Analyst"];

  useEffect(() => {
    getLearningResources()
      .then((items) => setResources(items))
      .catch(() => setResources([]))
      .finally(() => setLoadingResources(false));
  }, []);

  const handleGenerate = async () => {
    setError("");
    const isTopicMode = mode === "topic";
    const targetCareer = isTopicMode ? topic.trim() : role;

    if (!targetCareer) {
      setError(isTopicMode ? "Please enter a topic." : "Please choose a job role.");
      return;
    }

    const inferredMissing = isTopicMode
      ? [level, `Timeline: ${timeline}`]
      : roleSkills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    const analysis = {
      career: targetCareer,
      matchedSkills: [],
      missingSkills: inferredMissing.length ? inferredMissing : [`Level: ${level}`, `Timeline: ${timeline}`],
      strengthAreas: isTopicMode ? ["Self-paced learning"] : ["Role-focused preparation"],
    };

    try {
      setLoading(true);
      const data = await generateRoadmap({ analysis });
      const nextRoadmap = data?.roadmap || null;
      setRoadmap(nextRoadmap);
      localStorage.setItem("skillpath_result", JSON.stringify({ analysis, roadmap: nextRoadmap }));
    } catch {
      setError("Unable to generate roadmap right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="space-y-6">
        <div className="px-2">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text sm:text-6xl">
            AI Roadmap Generator
          </h1>
          <p className="mt-2 text-base text-[var(--muted)] sm:text-xl">
            Chart your course. Generate a plan by topic or a personalized plan for your dream job.
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-white/40 p-4 shadow-lg sm:p-6">
          <div className="mb-6 grid grid-cols-1 gap-2 rounded-2xl bg-white/50 p-2 dark:bg-white/10 sm:grid-cols-2">
            <button
              onClick={() => setMode("topic")}
              className={`rounded-xl px-4 py-3 text-lg font-semibold transition ${
                mode === "topic"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                  : "text-[var(--muted)] hover:bg-white/60 dark:hover:bg-white/15"
              }`}
            >
              Generate by Topic
            </button>
            <button
              onClick={() => setMode("role")}
              className={`rounded-xl px-4 py-3 text-lg font-semibold transition ${
                mode === "role"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                  : "text-[var(--muted)] hover:bg-white/60 dark:hover:bg-white/15"
              }`}
            >
              Generate for Job Role
            </button>
          </div>

          {mode === "topic" ? (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Topic</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 'Learn React Native' or 'Master System Design'"
                  className="w-full rounded-xl border border-slate-300/70 bg-white/80 px-4 py-3 text-xl outline-none transition focus:border-blue-500 dark:border-white/20 dark:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/70 bg-white/80 px-4 py-3 text-xl outline-none transition focus:border-blue-500 dark:border-white/20 dark:bg-white/10"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Preferred Timeline (Optional)</label>
                <input
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="3 Months"
                  className="w-full rounded-xl border-2 border-blue-500 bg-white/80 px-4 py-3 text-xl outline-none dark:border-blue-400 dark:bg-white/10"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Job Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/70 bg-white/80 px-4 py-3 text-xl outline-none transition focus:border-blue-500 dark:border-white/20 dark:bg-white/10"
                >
                  {roleOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Current Skills (Optional)</label>
                <input
                  value={roleSkills}
                  onChange={(e) => setRoleSkills(e.target.value)}
                  placeholder="Python, SQL, APIs, Docker"
                  className="w-full rounded-xl border border-slate-300/70 bg-white/80 px-4 py-3 text-xl outline-none transition focus:border-blue-500 dark:border-white/20 dark:bg-white/10"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-300">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-slate-100 px-4 py-4 text-2xl font-semibold text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </motion.button>
        </div>

        {roadmap && (
          <div className="space-y-3">
            <div className="glass-card rounded-3xl p-6">
              <p className="font-heading text-xl font-semibold">Generated Roadmap</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{roadmap.summary}</p>
            </div>
            {(roadmap.months || []).map((month) => (
              <details key={month.month} open className="glass-card rounded-3xl p-5">
                <summary className="cursor-pointer list-none font-heading text-lg font-semibold">
                  {month.month}: {month.focus}
                </summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {(month.weeklyPlan || []).map((week) => (
                    <li key={week} className="flex items-start gap-2 rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                      <input aria-label={`Mark ${week} complete`} type="checkbox" className="mt-1" />
                      <span>{week}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        )}

        <div id="resources" className="glass-card rounded-3xl p-6">
          <div className="mb-4">
            <p className="font-heading text-2xl font-bold">Learning Resources</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Curated free/paid learning paths and project ideas connected to your roadmap.
            </p>
          </div>
          {loadingResources ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="h-24 animate-pulse rounded-2xl bg-white/45 dark:bg-white/10" />
              <div className="h-24 animate-pulse rounded-2xl bg-white/45 dark:bg-white/10" />
            </div>
          ) : resources.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {resources.map((item) => (
                <a
                  key={`${item.title}-${item.provider}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/30 bg-white/55 p-4 transition hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {item.provider} • {item.type} • {item.domain}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white/55 px-3 py-2 text-sm text-[var(--muted)] dark:bg-white/10">
              No resources available right now.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
