import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BotMessageSquare,
  ChartNoAxesCombined,
  Compass,
  FileText,
  Home,
  Menu,
  MoonStar,
  Settings,
  Sparkles,
  SunMedium,
  Trophy,
  Users
} from "lucide-react";

const navSections = [
  {
    title: "Plan",
    items: [
      { to: "/", label: "Home", icon: Home },
      { to: "/dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
      { to: "/skill-analyzer", label: "Skill Analyzer", icon: Sparkles },
      { to: "/career-paths", label: "Career Paths", icon: Compass },
      { to: "/learning-roadmap", label: "Roadmap", icon: Trophy }
    ]
  },
  {
    title: "Practice",
    items: [
      { to: "/resume-analyzer", label: "Resume Analyzer", icon: FileText },
      { to: "/resume-builder", label: "Resume Builder", icon: FileText },
      { to: "/mock-interview", label: "Mock Interview", icon: BotMessageSquare },
      { to: "/aptitude-prep", label: "Aptitude Prep", icon: Sparkles },
      { to: "/community", label: "Leaderboard", icon: Users }
    ]
  },
  {
    title: "Track",
    items: [
      { to: "/progress-analytics", label: "Progress Analytics", icon: ChartNoAxesCombined }
    ]
  },
  {
    title: "Profile",
    items: [
      { to: "/profile", label: "My Profile", icon: Users },
      { to: "/about", label: "About", icon: FileText },
      { to: "/settings", label: "Settings", icon: Settings }
    ]
  }
];

export default function Layout({ children }) {
  const location = useLocation();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const flatItems = useMemo(() => navSections.flatMap((section) => section.items), []);

  return (
    <div className="min-h-screen text-[var(--text)]">
      <header className="sticky top-0 z-40 border-b border-white/25 bg-[var(--panel)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle navigation"
              className="rounded-xl bg-white/70 p-2 md:hidden dark:bg-white/10"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Menu size={18} />
            </button>
            <Link to="/" className="font-heading text-xl font-bold">
              SkillPath
            </Link>
            <span className="hidden rounded-full bg-cyan-300/30 px-3 py-1 text-xs font-semibold md:inline">
              AI Career Platform
            </span>
          </div>
          <button
            onClick={() => setDark((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-white"
          >
            {dark ? <SunMedium size={16} /> : <MoonStar size={16} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-5 md:px-8">
        <aside className={`glass-card soft-grid h-[calc(100vh-7rem)] w-72 rounded-3xl p-5 ${mobileOpen ? "block" : "hidden"} md:sticky md:top-20 md:block`}>
          <nav aria-label="Primary navigation" className="h-full space-y-6 overflow-auto pr-1">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {section.title}
                </p>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                          active
                            ? "bg-white/75 shadow-glow dark:bg-white/10"
                            : "hover:bg-white/45 dark:hover:bg-white/5"
                        }`}
                      >
                        <Icon size={17} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="w-full">
          <div className="mb-4 flex gap-2 overflow-auto md:hidden">
            {flatItems.slice(0, 7).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs ${
                  location.pathname === item.to ? "bg-[var(--brand)] text-white" : "glass-card"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
