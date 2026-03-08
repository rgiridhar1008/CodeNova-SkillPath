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
import { careerExplorerData } from "../data/careerExplorerData";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function MultiCareerComparisonPage() {
  const [selected, setSelected] = useState(["Data Scientist", "AI Engineer"]);

  const selectedCareers = useMemo(
    () => careerExplorerData.filter((career) => selected.includes(career.name)).slice(0, 3),
    [selected]
  );

  const chartData = useMemo(() => {
    return {
      labels: ["Difficulty", "Learning Time", "Demand", "Salary", "Skill Breadth"],
      datasets: selectedCareers.map((career, idx) => ({
        label: career.name,
        data: [
          career.difficulty,
          Math.min(10, Math.round(career.learningMonths / 1.2)),
          career.demand === "Explosive" ? 10 : career.demand === "Very High" ? 9 : 7,
          Math.min(10, Math.round(Number(career.salary.replace(/[^0-9]/g, "")) / 15)),
          Math.min(10, career.requiredSkills.length + 3)
        ],
        backgroundColor: idx === 0 ? "rgba(47,103,248,0.2)" : idx === 1 ? "rgba(39,179,161,0.2)" : "rgba(243,156,18,0.2)",
        borderColor: idx === 0 ? "#2f67f8" : idx === 1 ? "#27b3a1" : "#f39c12",
        borderWidth: 2
      }))
    };
  }, [selectedCareers]);

  const bestFit = [...selectedCareers].sort((a, b) => a.difficulty - b.difficulty)[0];

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Multi-Career Comparison</h1>
          <p className="text-sm text-[var(--muted)]">
            Compare up to 3 careers by difficulty, salary, demand, and learning time.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {careerExplorerData.map((career) => {
              const active = selected.includes(career.name);
              return (
                <button
                  key={career.name}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSelected((prev) => prev.filter((item) => item !== career.name));
                    } else if (selected.length < 3) {
                      setSelected((prev) => prev.concat(career.name));
                    }
                  }}
                  className={`rounded-xl border p-3 text-left text-sm transition ${
                    active ? "border-[var(--brand)] bg-[var(--brand)]/15" : "border-white/30 bg-white/60 dark:bg-white/5"
                  }`}
                >
                  {career.name}
                </button>
              );
            })}
          </div>
        </div>

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
          <div className="glass-card rounded-3xl p-6">
            <p className="font-heading text-xl font-semibold">Comparison Highlights</p>
            {selectedCareers.map((career) => (
              <article key={career.name} className="mt-3 rounded-2xl border border-white/25 bg-white/50 p-4 dark:bg-white/5">
                <p className="font-semibold">{career.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  Difficulty {career.difficulty}/10 • {career.learningMonths} months • {career.salary}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{career.growthPath}</p>
              </article>
            ))}
            {bestFit && (
              <p className="mt-4 rounded-xl bg-emerald-500/15 p-3 text-sm">
                Best-fit recommendation: <strong>{bestFit.name}</strong> for faster entry with strong demand.
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
