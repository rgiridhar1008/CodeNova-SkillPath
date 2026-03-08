import { useState } from "react";
import Layout from "../components/Layout";

export default function SettingsPage() {
  const [domains, setDomains] = useState(["Tech"]);
  const [level, setLevel] = useState("Intermediate");
  const [notifications, setNotifications] = useState(true);

  const toggleDomain = (item) => {
    setDomains((prev) => (prev.includes(item) ? prev.filter((d) => d !== item) : prev.concat(item)));
  };

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Settings</h1>
          <p className="text-sm text-[var(--muted)]">
            Customize preferred domains, proficiency baseline, and notifications.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="font-semibold">Preferred Career Domains</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Tech", "Management", "Core", "Design"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleDomain(item)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  domains.includes(item) ? "bg-[var(--brand)] text-white" : "bg-white/60 dark:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="font-semibold">Skill Proficiency Level</p>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="mt-2 rounded-xl border border-white/30 bg-white/65 px-3 py-2 dark:bg-white/5"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span className="text-sm">Enable weekly roadmap reminders</span>
          </label>
        </div>
      </section>
    </Layout>
  );
}
