import { useEffect, useMemo, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Layout from "../components/Layout";
import { getAdminAnalytics } from "../api/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    getAdminAnalytics().then(setData).catch(() => setData(null));
  }, []);

  const usageData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };
    return {
      labels: data.usageByPage.map((i) => i.page),
      datasets: [
        {
          label: "Page Views",
          data: data.usageByPage.map((i) => i.views),
          backgroundColor: ["#2f67f8", "#14b8a6", "#0c4a6e"]
        }
      ]
    };
  }, [data]);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Admin Analytics Panel</h1>
          <p className="text-sm text-[var(--muted)]">
            Monitor user growth, role trends, skill demand patterns, and product usage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Total Users" value={data?.usersTotal ?? 0} />
          <Metric label="Weekly Active Users" value={data?.weeklyActiveUsers ?? 0} />
          <Metric label="Top Career Path" value={data?.topCareerPaths?.[0] ?? "N/A"} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6">
            <p className="mb-3 font-heading text-lg font-semibold">Platform Usage</p>
            <Bar data={usageData} />
          </div>
          <div className="glass-card rounded-3xl p-6">
            <p className="font-heading text-lg font-semibold">Skill Trend Analysis</p>
            <div className="mt-3 space-y-2">
              {(data?.skillTrends || []).map((row) => (
                <div key={row.skill} className="flex items-center justify-between rounded-xl bg-white/55 px-3 py-2 text-sm dark:bg-white/10">
                  <span>{row.skill}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{row.growth}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Metric({ label, value }) {
  return (
    <article className="glass-card rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-heading text-2xl font-semibold">{value}</p>
    </article>
  );
}
