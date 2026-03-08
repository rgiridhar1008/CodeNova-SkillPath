import { useMemo } from "react";
import Layout from "../components/Layout";

export default function AdvancedAnalyticsPage() {
  const analysis = useMemo(() => {
    const raw = localStorage.getItem("skillpath_result");
    return raw ? JSON.parse(raw).analysis : null;
  }, []);

  const skills = analysis?.careerSkills || [];
  const matched = new Set(analysis?.matchedSkills || []);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <p className="text-sm text-[var(--muted)]">
            Heatmap-style skill readiness, proficiency bars, and missing-skill priority view.
          </p>
        </div>

        {!analysis ? (
          <div className="glass-card rounded-3xl p-6 text-sm text-[var(--muted)]">
            Run an analysis first to unlock advanced insights.
          </div>
        ) : (
          <>
            <div className="glass-card rounded-3xl p-6">
              <p className="font-heading text-lg font-semibold">Skill Match Heatmap</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className={`rounded-xl px-3 py-2 text-sm ${
                      matched.has(skill) ? "bg-emerald-500/20" : "bg-rose-500/15"
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <p className="font-heading text-lg font-semibold">Missing Skill Priority</p>
              <div className="mt-3 space-y-3">
                {(analysis.missingSkills || []).slice(0, 8).map((skill, idx) => (
                  <div key={skill}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span>{skill}</span>
                      <span>Priority {idx + 1}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/30">
                      <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${100 - idx * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
