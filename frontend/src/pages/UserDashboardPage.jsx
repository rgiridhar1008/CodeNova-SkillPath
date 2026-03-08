import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Flame, Sparkles, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FeatureCard from "../components/dashboard/FeatureCard";
import ProfileMenu from "../components/dashboard/ProfileMenu";
import { dashboardFeatures } from "../data/dashboardFeatures";
import { getProgressSummary } from "../api/client";
import {
  getDailyTasks,
  getOnboarding,
  isOnboardingComplete,
  saveDailyTasks,
} from "../utils/userExperience";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("skillpath_username") || "abc";
  const onboarding = getOnboarding();
  const [tasks, setTasks] = useState(getDailyTasks());
  const [summary, setSummary] = useState({
    hoursThisWeek: 0,
    streakDays: 0,
    xp: 0,
    completedTasks: 0,
    milestones: [],
  });
  const [loadingSummary, setLoadingSummary] = useState(true);

  const activeRoadmaps = useMemo(() => {
    const raw = localStorage.getItem("skillpath_result");
    return raw ? 1 : 0;
  }, []);

  useEffect(() => {
    if (!isOnboardingComplete()) {
      navigate("/onboarding", { replace: true });
      return;
    }
    getProgressSummary()
      .then((data) => setSummary(data))
      .catch(() => {})
      .finally(() => setLoadingSummary(false));
  }, [navigate]);

  const completedCount = tasks.filter((task) => task.done).length;
  const nextAction =
    tasks.find((task) => !task.done)?.title ||
    (onboarding?.targetRole
      ? `Review this week's ${onboarding.targetRole} roadmap module`
      : "Complete onboarding to get your personalized roadmap");

  return (
    <Layout>
      <section className="space-y-5">
        <div className="glass-card rounded-3xl p-6 shadow-md md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-4xl font-bold md:text-5xl">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {username}
                </span>
              </h1>
              <p className="mt-3 text-xl text-[var(--muted)]">
                You have <span className="font-semibold text-[var(--text)]">{activeRoadmaps}</span>{" "}
                active learning roadmaps. Ready to level up?
              </p>
            </div>
            <ProfileMenu />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <article className="glass-card rounded-3xl p-6 xl:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                  <Sparkles size={14} />
                  Today
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold">Your Daily Mission</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Finish focused tasks to maintain your streak and improve readiness.
                </p>
              </div>
              <span className="rounded-xl bg-white/65 px-3 py-1 text-sm font-semibold dark:bg-white/10">
                {completedCount}/{tasks.length} done
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    const next = tasks.map((item) =>
                      item.id === task.id ? { ...item, done: !item.done } : item
                    );
                    setTasks(next);
                    saveDailyTasks(next);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white/55 px-3 py-3 text-left transition hover:bg-white/75 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  {task.done ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Circle size={18} className="text-[var(--muted)]" />
                  )}
                  <span className={`text-sm ${task.done ? "line-through opacity-70" : ""}`}>
                    {task.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-400/25 bg-cyan-300/10 p-3 text-sm">
              <p className="font-semibold">Next Recommended Action</p>
              <p className="mt-1 text-[var(--muted)]">{nextAction}</p>
            </div>
          </article>

          <article className="glass-card rounded-3xl p-6">
            <p className="font-heading text-xl font-semibold">This Week</p>
            {loadingSummary ? (
              <div className="mt-4 space-y-2">
                <div className="h-12 animate-pulse rounded-xl bg-white/40 dark:bg-white/10" />
                <div className="h-12 animate-pulse rounded-xl bg-white/40 dark:bg-white/10" />
                <div className="h-12 animate-pulse rounded-xl bg-white/40 dark:bg-white/10" />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="rounded-2xl bg-white/60 px-3 py-3 dark:bg-white/10">
                  <p className="inline-flex items-center gap-2 text-xs text-[var(--muted)]">
                    <Timer size={14} />
                    Learning Hours
                  </p>
                  <p className="mt-1 text-xl font-bold">{summary.hoursThisWeek}h</p>
                </div>
                <div className="rounded-2xl bg-white/60 px-3 py-3 dark:bg-white/10">
                  <p className="inline-flex items-center gap-2 text-xs text-[var(--muted)]">
                    <Flame size={14} />
                    Streak
                  </p>
                  <p className="mt-1 text-xl font-bold">{summary.streakDays} days</p>
                </div>
                <div className="rounded-2xl bg-white/60 px-3 py-3 dark:bg-white/10">
                  <p className="text-xs text-[var(--muted)]">XP</p>
                  <p className="mt-1 text-xl font-bold">{summary.xp}</p>
                </div>
              </div>
            )}
          </article>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboardFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
