import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
} from "chart.js";
import { Radar } from "react-chartjs-2";
import Layout from "../components/Layout";
import { getCareerRecommendations } from "../api/client";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function CareerPathsPage() {
  const [skills, setSkills] = useState("Python, SQL, Docker, React");
  const [results, setResults] = useState([]);

  const runRecommend = async () => {
    const data = await getCareerRecommendations(skills);
    setResults(data);
  };

  const chartData = useMemo(() => {
    return {
      labels: ["Confidence", "Skill Match", "Learning Speed", "Market Demand", "Portfolio Fit"],
      datasets: results.map((item, idx) => ({
        label: item.career,
        data: [
          Math.round(item.confidenceScore / 10),
          Math.round(item.confidenceScore / 10),
          Math.max(4, 10 - Math.round((item.missingSkills.length || 0) / 2)),
          idx === 0 ? 9 : idx === 1 ? 8 : 7,
          Math.max(5, 10 - idx)
        ],
        backgroundColor: idx === 0 ? "rgba(47,103,248,0.18)" : idx === 1 ? "rgba(20,184,166,0.18)" : "rgba(12,74,110,0.18)",
        borderColor: idx === 0 ? "#2f67f8" : idx === 1 ? "#14b8a6" : "#0c4a6e",
        borderWidth: 2
      }))
    };
  }, [results]);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Career Paths</h1>
          <p className="text-sm text-[var(--muted)]">
            AI recommender suggests best-fit career paths with confidence scoring and role comparison.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="min-w-[250px] flex-1 rounded-xl border border-white/30 bg-white/70 px-3 py-2 dark:bg-white/5"
              placeholder="Enter skills comma-separated"
            />
            <button
              onClick={runRecommend}
              className="rounded-xl bg-[var(--brand)] px-4 py-2 font-semibold text-white"
            >
              Get AI Suggestions
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="glass-card rounded-3xl p-6">
              <Radar
                data={chartData}
                options={{
                  scales: { r: { suggestedMin: 0, suggestedMax: 10 } },
                  plugins: { legend: { position: "bottom" } }
                }}
              />
            </div>
            <div className="space-y-3">
              {results.map((item) => (
                <article key={item.career} className="glass-card rounded-3xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-lg font-semibold">{item.career}</p>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold">
                      {item.confidenceScore}% confidence
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                    Missing Skills
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.missingSkills.slice(0, 6).map((skill) => (
                      <span key={skill} className="rounded-full bg-white/70 px-2 py-1 text-xs dark:bg-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
