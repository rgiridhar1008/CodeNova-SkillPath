import { useEffect, useMemo, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Layout from "../components/Layout";
import { getProgressSummary } from "../api/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function ProgressAnalyticsPage() {
  const [progress, setProgress] = useState(null);
  useEffect(() => {
    getProgressSummary().then(setProgress).catch(() => setProgress(null));
  }, []);

  const lineData = useMemo(
    () => ({
      labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      datasets: [
        {
          label: "Skill Mastery",
          data: [24, 31, 38, 51, 63, 70],
          borderColor: "#2f67f8",
          backgroundColor: "rgba(47,103,248,0.2)"
        }
      ]
    }),
    []
  );

  const barData = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Learning Hours",
          data: [1, 2, 2, 1, 3, 1, 1],
          backgroundColor: "#14b8a6"
        }
      ]
    }),
    []
  );

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Progress Analytics</h1>
          <p className="text-sm text-[var(--muted)]">
            Skill mastery timeline, productivity stats, learning hours, and milestones.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Kpi label="Streak" value={`${progress?.streakDays || 0} days`} />
          <Kpi label="Hours This Week" value={`${progress?.hoursThisWeek || 0}h`} />
          <Kpi label="Completed Tasks" value={`${progress?.completedTasks || 0}`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6">
            <p className="mb-3 font-heading text-lg font-semibold">Skill Mastery Timeline</p>
            <Line data={lineData} />
          </div>
          <div className="glass-card rounded-3xl p-6">
            <p className="mb-3 font-heading text-lg font-semibold">Weekly Productivity</p>
            <Bar data={barData} />
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-heading text-2xl font-semibold">{value}</p>
    </div>
  );
}
