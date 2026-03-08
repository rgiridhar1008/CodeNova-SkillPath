import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authenticateUser } from "../utils/auth";
import { isOnboardingComplete } from "../utils/userExperience";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "";
  const from = location.state?.from || (isOnboardingComplete() ? "/dashboard" : "/onboarding");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await authenticateUser({ email, password });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md rounded-3xl p-7"
      >
        <h1 className="font-heading text-3xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Access your dashboard and continue your learning roadmap.
        </p>
        {message && (
          <p className="mt-4 rounded-xl bg-amber-500/15 px-3 py-2 text-sm font-medium">
            {message}
          </p>
        )}

        <div className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 outline-none dark:bg-white/10"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 outline-none dark:bg-white/10"
          />
          {error && (
            <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 font-semibold text-white"
          >
            Login
          </motion.button>
          <p className="text-center text-sm text-[var(--muted)]">
            New user?{" "}
            <Link to="/register" className="font-semibold text-blue-600 dark:text-cyan-400">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
