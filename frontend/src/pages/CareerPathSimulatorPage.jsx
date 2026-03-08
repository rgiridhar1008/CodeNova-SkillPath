import { useMemo, useState } from "react";
import Layout from "../components/Layout";

const baseRoles = {
  Beginner: [
    { title: "Intern / Trainee", salary: "$18k" },
    { title: "Junior Engineer", salary: "$45k" },
    { title: "Mid-level Engineer", salary: "$72k" },
    { title: "Senior Engineer", salary: "$110k" }
  ],
  Intermediate: [
    { title: "Junior Engineer", salary: "$52k" },
    { title: "Mid-level Engineer", salary: "$84k" },
    { title: "Senior Engineer", salary: "$124k" },
    { title: "Tech Lead", salary: "$152k" }
  ]
};

export default function CareerPathSimulatorPage() {
  const [level, setLevel] = useState("Beginner");
  const timeline = useMemo(() => baseRoles[level], [level]);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Career Path Simulator</h1>
          <p className="text-sm text-[var(--muted)]">
            Visualize a 2-year progression path with future roles and salary growth.
          </p>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="mt-4 rounded-xl border border-white/25 bg-white/65 px-3 py-2 dark:bg-white/5"
          >
            {Object.keys(baseRoles).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {timeline.map((item, idx) => (
            <article key={item.title} className="glass-card rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-[var(--muted)]">Phase {idx + 1}</p>
              <p className="mt-2 font-heading text-lg font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.salary}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
