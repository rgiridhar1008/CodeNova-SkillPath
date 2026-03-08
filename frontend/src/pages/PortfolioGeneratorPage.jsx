import { useState } from "react";
import Layout from "../components/Layout";

export default function PortfolioGeneratorPage() {
  const [name, setName] = useState("Alex Johnson");
  const [headline, setHeadline] = useState("AI Engineer | Building practical AI products");
  const [projects, setProjects] = useState("RAG Assistant, Resume Analyzer, Skill Gap Dashboard");

  return (
    <Layout>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Portfolio Generator</h1>
          <p className="text-sm text-[var(--muted)]">
            Auto-generate a personal portfolio page and shareable profile summary.
          </p>
          <div className="mt-4 space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/25 bg-white/70 p-3 dark:bg-white/5" />
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full rounded-xl border border-white/25 bg-white/70 p-3 dark:bg-white/5" />
            <textarea value={projects} onChange={(e) => setProjects(e.target.value)} rows={4} className="w-full rounded-xl border border-white/25 bg-white/70 p-3 dark:bg-white/5" />
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="font-heading text-lg font-semibold">Live Portfolio Preview</p>
          <div className="mt-3 rounded-2xl border border-white/25 bg-white/55 p-4 dark:bg-white/5">
            <p className="font-heading text-xl font-bold">{name}</p>
            <p className="text-sm text-[var(--muted)]">{headline}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Projects</p>
            <p className="text-sm">{projects}</p>
          </div>
          <button className="mt-4 rounded-xl bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white">
            Generate Shareable Link
          </button>
        </div>
      </section>
    </Layout>
  );
}
