import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { careerExplorerData } from "../data/careerExplorerData";

const domains = ["All", "Tech", "Management", "Core", "Design"];

export default function CareerExplorerPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");

  const items = useMemo(() => {
    return careerExplorerData.filter((career) => {
      const queryMatch = career.name.toLowerCase().includes(query.toLowerCase());
      const domainMatch = domain === "All" || career.domain === domain;
      return queryMatch && domainMatch;
    });
  }, [query, domain]);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Career Explorer</h1>
          <p className="text-sm text-[var(--muted)]">
            Discover salary, demand, core skills, and growth path before choosing your roadmap.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-2 rounded-2xl border border-white/35 bg-white/65 px-3 dark:bg-white/5">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent p-3 outline-none"
                placeholder="Search careers..."
              />
            </div>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="rounded-2xl border border-white/35 bg-white/65 px-3 py-3 dark:bg-white/5"
            >
              {domains.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((career, idx) => (
            <motion.article
              key={career.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-3xl p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-semibold">{career.name}</h3>
                <span className="rounded-full bg-[var(--brand)]/15 px-3 py-1 text-xs font-semibold">
                  {career.domain}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Average Salary" value={career.salary} />
                <Metric label="Demand" value={career.demand} />
                <Metric label="Difficulty" value={`${career.difficulty}/10`} />
                <Metric label="Learning Time" value={`${career.learningMonths} months`} />
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">{career.growthPath}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {career.requiredSkills.slice(0, 6).map((skill) => (
                  <span key={skill} className="rounded-full bg-white/60 px-3 py-1 text-xs dark:bg-white/10">
                    {skill}
                  </span>
                ))}
              </div>
              <Link
                to="/analyze"
                className="mt-4 inline-block rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
              >
                View Roadmap
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/25 bg-white/45 p-3 dark:bg-white/5">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
