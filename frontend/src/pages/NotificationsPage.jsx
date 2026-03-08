import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getNotificationPreview } from "../api/client";

export default function NotificationsPage() {
  const [days, setDays] = useState(2);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getNotificationPreview(days).then(setAlerts).catch(() => setAlerts([]));
  }, [days]);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Smart Notifications</h1>
          <p className="text-sm text-[var(--muted)]">
            Deadline reminders, weekly alerts, and stagnation signals for steady progress.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="stagnation" className="text-sm font-medium">
              Stagnation days
            </label>
            <input
              id="stagnation"
              type="number"
              min={0}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-24 rounded-xl border border-white/30 bg-white/70 px-2 py-1 dark:bg-white/10"
            />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="font-heading text-lg font-semibold">Preview Alerts</p>
          <ul className="mt-3 space-y-2 text-sm">
            {alerts.map((alert) => (
              <li key={alert} className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                {alert}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}
