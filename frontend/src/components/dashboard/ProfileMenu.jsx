import { useEffect, useRef, useState } from "react";
import { ChevronDown, UserCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../utils/auth";

const items = [
  { label: "My Profile", to: "/profile" },
  { label: "My Roadmaps", to: "/features/roadmap-generator" },
  { label: "Saved Resources", to: "/features/learning-resources" },
  { label: "Certificates", to: "/progress-analytics" },
  { label: "Settings", to: "/settings" }
];

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-xl bg-white/70 px-2 py-2 dark:bg-white/10"
        aria-label="Open profile dropdown"
      >
        <UserCircle2 size={18} />
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-20 w-52 rounded-2xl border border-white/25 bg-[var(--panel)] p-2 backdrop-blur-xl">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="block rounded-xl px-3 py-2 text-sm transition hover:bg-white/50 dark:hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              logoutUser();
              navigate("/login");
            }}
            className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/50 dark:hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
