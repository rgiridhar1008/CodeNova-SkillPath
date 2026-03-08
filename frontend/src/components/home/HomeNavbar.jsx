import { useEffect, useRef, useState } from "react";
import { Bell, BriefcaseBusiness, ChevronDown, Menu, Moon, Sun, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../../utils/auth";
import { isOnboardingComplete } from "../../utils/userExperience";

const links = [
  { label: "Plan", to: "/learning-roadmap" },
  { label: "Practice", to: "/mock-interview" },
  { label: "Track", to: "/progress-analytics" },
  { label: "Profile", to: "/profile" },
  { label: "About", to: "/about" },
  { label: "Dashboard", to: "/dashboard" },
];

export default function HomeNavbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const goGetStarted = () => {
    if (isAuthenticated()) {
      navigate(isOnboardingComplete() ? "/dashboard" : "/onboarding");
    } else {
      navigate("/login", { state: { message: "Please login to continue your journey." } });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-[var(--panel)]/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-2 text-white">
            <BriefcaseBusiness size={16} />
          </span>
          <span className="font-heading text-xl font-bold">SkillPath</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle dark mode"
            className="rounded-xl bg-white/65 p-2 transition hover:brightness-95 dark:bg-white/10"
            onClick={() => setDark((v) => !v)}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            aria-label="Notifications"
            className="rounded-xl bg-white/65 p-2 transition hover:brightness-95 dark:bg-white/10"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={17} />
          </button>

          <div className="relative hidden sm:block" ref={menuRef}>
            <button
              aria-label="Open profile menu"
              className="inline-flex items-center gap-1 rounded-xl bg-white/65 px-2 py-2 dark:bg-white/10"
              onClick={() => setOpen((v) => !v)}
            >
              <User size={16} />
              <ChevronDown size={14} />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-white/25 bg-[var(--panel)] p-2 backdrop-blur-xl">
                <button
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/50 dark:hover:bg-white/10"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  My Profile
                </button>
                <button
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/50 dark:hover:bg-white/10"
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </button>
                <button
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/50 dark:hover:bg-white/10"
                  onClick={() => {
                    logoutUser();
                    setOpen(false);
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={goGetStarted}
            className="hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 md:inline-block"
          >
            Get Started
          </button>

          <button
            aria-label="Toggle mobile menu"
            className="rounded-xl bg-white/65 p-2 md:hidden dark:bg-white/10"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/25 bg-[var(--panel)] px-4 py-3 md:hidden">
          <div className="space-y-2">
            {links.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-2 py-2 text-sm font-semibold text-[var(--muted)]"
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                goGetStarted();
              }}
              className="mt-1 block w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
