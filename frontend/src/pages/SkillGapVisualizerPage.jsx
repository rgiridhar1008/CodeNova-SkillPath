import { useMemo, useState } from "react";
import Layout from "../components/Layout";

export default function SkillGapVisualizerPage() {
  const analysis = useMemo(() => {
    const raw = localStorage.getItem("skillpath_result");
    return raw ? JSON.parse(raw).analysis : null;
  }, []);
  const [done, setDone] = useState([]);

  const nodes = (analysis?.careerSkills || []).map((skill, idx) => ({
    skill,
    order: idx + 1,
    prerequisite: idx === 0 ? null : (analysis?.careerSkills || [])[idx - 1]
  }));

  const toggle = (skill) =>
    setDone((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : prev.concat(skill)));

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Skill Gap Visualizer</h1>
          <p className="text-sm text-[var(--muted)]">
            Interactive skill-tree style view with prerequisites and suggested learning order.
          </p>
        </div>

        {!analysis ? (
          <div className="glass-card rounded-3xl p-6 text-sm text-[var(--muted)]">
            Analyze skills first to view your personalized skill graph.
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {nodes.map((node) => {
                const completed = done.includes(node.skill);
                return (
                  <button
                    type="button"
                    key={node.skill}
                    onClick={() => toggle(node.skill)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      completed
                        ? "border-emerald-400/50 bg-emerald-500/20"
                        : "border-white/25 bg-white/55 dark:bg-white/5"
                    }`}
                  >
                    <p className="text-xs text-[var(--muted)]">Step {node.order}</p>
                    <p className="font-semibold">{node.skill}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Prerequisite: {node.prerequisite || "Foundations"}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Progress: {done.length}/{nodes.length} skills completed.
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
}
