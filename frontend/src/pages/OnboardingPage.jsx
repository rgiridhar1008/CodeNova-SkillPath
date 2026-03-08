import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { generateRoadmap } from "../api/client";
import { saveOnboarding } from "../utils/userExperience";

const roles = [
  "Data Scientist",
  "Web Developer",
  "AI Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "ML Engineer",
  "Data Analyst",
  "Business Analyst",
  "Product Manager",
  "UI/UX Designer",
  "Mobile App Developer",
  "QA Engineer",
  "Software Engineer",
  "Solutions Architect",
  "Site Reliability Engineer",
  "Blockchain Developer",
];
const hourBands = ["3-5 hrs/week", "6-8 hrs/week", "9-12 hrs/week", "12+ hrs/week"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState("Data Scientist");
  const [skills, setSkills] = useState("Python, SQL");
  const [hoursPerWeek, setHoursPerWeek] = useState("6-8 hrs/week");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finishOnboarding = async () => {
    setError("");
    if (!targetRole || !skills.trim() || !hoursPerWeek) {
      setError("Please complete all onboarding fields.");
      return;
    }

    const onboarding = {
      targetRole,
      skills: skills.trim(),
      hoursPerWeek,
      completedAt: new Date().toISOString(),
    };
    saveOnboarding(onboarding);

    try {
      setLoading(true);
      const skillArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const analysis = {
        career: targetRole,
        matchedSkills: [],
        missingSkills: skillArray.length ? skillArray.slice(0, 6) : ["Foundational skills"],
        strengthAreas: ["Self-driven learning"],
      };
      const data = await generateRoadmap({ analysis });
      localStorage.setItem("skillpath_result", JSON.stringify({ analysis, roadmap: data?.roadmap || null }));
    } catch {
      // onboarding should still continue even if roadmap call fails
    } finally {
      setLoading(false);
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl rounded-3xl p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Onboarding
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold">Set Up Your Learning Journey</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Tell us your target role, current skills, and weekly time. We will personalize your dashboard.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-2 rounded-full ${n <= step ? "bg-[var(--brand)]" : "bg-white/35"}`} />
          ))}
        </div>

        <div className="mt-6 space-y-5">
          {step === 1 && (
            <div>
              <label className="mb-2 block text-sm font-semibold">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2.5 dark:bg-white/10"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="mb-2 block text-sm font-semibold">Current Skills (comma separated)</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2.5 dark:bg-white/10"
                placeholder="Python, SQL, React..."
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="mb-2 block text-sm font-semibold">Available Study Time</label>
              <select
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2.5 dark:bg-white/10"
              >
                {hourBands.map((band) => (
                  <option key={band}>{band}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">{error}</p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1 || loading}
            className="rounded-xl border border-white/35 px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => Math.min(3, prev + 1))}
              className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finishOnboarding}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {loading ? "Personalizing..." : "Finish & Open Dashboard"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
