import { motion } from "framer-motion";

export default function RoadmapTimeline({ roadmap }) {
  if (!roadmap?.months?.length) return null;

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="font-heading text-lg font-semibold">3-Month AI Roadmap</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{roadmap.summary}</p>
      <div className="mt-5 space-y-4">
        {roadmap.months.map((month, idx) => (
          <motion.div
            key={month.month}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="rounded-2xl border border-white/20 bg-white/55 p-4 dark:bg-white/5"
          >
            <p className="font-heading text-base font-semibold">{month.month}</p>
            <p className="text-sm text-[var(--muted)]">{month.focus}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {month.weeklyPlan?.map((week) => (
                <li key={week}>• {week}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
