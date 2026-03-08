import { Flame, Medal, Target } from "lucide-react";
import Layout from "../components/Layout";

const badges = ["Roadmap Starter", "Consistency Streak", "Portfolio Builder", "Interview Ready"];

export default function GamifiedProgressPage() {
  const xp = 740;
  const level = 5;
  const nextLevel = 900;
  const percent = Math.round((xp / nextLevel) * 100);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Gamified Progress</h1>
          <p className="text-sm text-[var(--muted)]">
            Track XP, streaks, badges, and weekly goals to stay consistent.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat icon={Medal} label="Current Level" value={`Level ${level}`} />
          <Stat icon={Flame} label="Learning Streak" value="12 days" />
          <Stat icon={Target} label="Weekly Goal" value="4/5 tasks" />
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm font-semibold">XP Progress</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/30">
            <div className="h-full bg-[var(--brand)]" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{xp} / {nextLevel} XP</p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="font-heading text-lg font-semibold">Achievement Badges</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <article className="glass-card rounded-3xl p-5">
      <div className="inline-flex rounded-xl bg-white/70 p-2 dark:bg-white/10">
        <Icon size={16} />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">{label}</p>
      <p className="font-heading text-xl font-semibold">{value}</p>
    </article>
  );
}
