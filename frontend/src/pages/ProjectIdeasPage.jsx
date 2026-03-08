import { useState } from "react";
import Layout from "../components/Layout";

const ideas = [
  { title: "Churn Prediction Dashboard", career: "Data Scientist", difficulty: "Medium", skills: ["Python", "ML", "SQL"] },
  { title: "RAG Knowledge Assistant", career: "AI Engineer", difficulty: "Hard", skills: ["LLMs", "RAG", "Vector DB"] },
  { title: "Cloud Cost Optimizer", career: "Cloud Engineer", difficulty: "Medium", skills: ["AWS", "Terraform", "CI/CD"] },
  { title: "Vulnerability Scanner UI", career: "Cybersecurity Analyst", difficulty: "Hard", skills: ["OWASP", "Python", "Security"] },
  { title: "Portfolio SaaS Template", career: "Web Developer", difficulty: "Easy", skills: ["React", "Tailwind", "APIs"] }
];

export default function ProjectIdeasPage() {
  const [difficulty, setDifficulty] = useState("All");
  const filtered = ideas.filter((item) => difficulty === "All" || item.difficulty === difficulty);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Project Ideas</h1>
          <p className="text-sm text-[var(--muted)]">
            Portfolio-ready ideas by career path with skills and GitHub-first execution.
          </p>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-4 rounded-xl border border-white/25 bg-white/65 px-3 py-2 dark:bg-white/5"
          >
            {["All", "Easy", "Medium", "Hard"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <article key={item.title} className="glass-card rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-[var(--muted)]">
                {item.career} • {item.difficulty}
              </p>
              <h3 className="mt-2 font-heading text-lg font-semibold">{item.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-white/60 px-3 py-1 text-xs dark:bg-white/10">
                    {skill}
                  </span>
                ))}
              </div>
              <button className="mt-4 rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">
                Add to My Plan
              </button>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
