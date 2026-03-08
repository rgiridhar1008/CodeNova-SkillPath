import { motion } from "framer-motion";
import {
  BotMessageSquare,
  ChartNoAxesColumnIncreasing,
  FileBadge2,
  Route
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/home/HomeNavbar";
import FeatureCard from "../components/home/FeatureCard";
import { isAuthenticated } from "../utils/auth";
import { isOnboardingComplete } from "../utils/userExperience";

const features = [
  {
    icon: Route,
    title: "Career Roadmaps",
    description: "AI-powered step-by-step plans personalized to your target role and current skills."
  },
  {
    icon: FileBadge2,
    title: "Resume Builder",
    description: "Create ATS-friendly resumes with optimized structure, keywords, and impact bullets."
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Dashboard",
    description: "Track skill growth, learning streaks, and weekly momentum from a unified command center."
  },
  {
    icon: BotMessageSquare,
    title: "Feedback System",
    description: "Get mentor and AI-driven feedback for interview prep, roadmap updates, and career clarity."
  }
];

export default function HomePage() {
  const navigate = useNavigate();

  const checkAuth = () => {
    if (isAuthenticated()) {
      navigate(isOnboardingComplete() ? "/dashboard" : "/onboarding");
    } else {
      navigate("/login", {
        state: { message: "Please login to continue your journey." }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <HomeNavbar />

      <section id="get-started" className="relative overflow-hidden px-4 pb-14 pt-14 md:px-8 md:pt-20">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-14 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-5xl text-center"
        >
          <span className="inline-flex rounded-full border border-white/30 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] dark:bg-white/10">
            AI Career Development Platform
          </span>

          <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
            Build Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              Career Journey
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--muted)] md:text-lg">
            Accelerate your growth with AI-guided roadmaps, ATS-ready resume tools, progress
            analytics, and actionable mentor feedback in one modern workspace.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={checkAuth}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              Start Your Journey
            </motion.button>
            <a
              href="#how-it-works"
              className="rounded-2xl border border-white/35 bg-white/65 px-6 py-3 font-semibold transition hover:bg-white/85 dark:bg-white/10 dark:hover:bg-white/20"
            >
              How It Works
            </a>
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">How It Works</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              "Upload your resume or add skills manually.",
              "Get AI-powered skill gap analysis + career fit score.",
              "Follow a structured roadmap and track your progress."
            ].map((item) => (
              <article key={item} className="rounded-2xl border border-white/25 bg-white/55 p-4 text-sm dark:bg-white/10">
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Feature Highlights</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Everything you need to build a real-world, job-ready career profile.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </section>

      <section id="feedback" className="border-t border-white/25 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg font-semibold text-[var(--text)]">Developed by Team CodeNova</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Rachakonda Lakshmi Sai Giridhar | Mani MahaLakshmi Vale | Pranathi Prathipati |
            DonthiReddy Krishna Chaitanya | Emani Mahathi
          </p>
        </div>
      </section>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4 md:hidden">
        <button
          onClick={checkAuth}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
}
