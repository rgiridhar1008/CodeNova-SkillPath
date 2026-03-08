import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileUp, FlaskConical, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingOverlay from "../components/LoadingOverlay";
import { getJobStatus, startAnalysisJob, suggestSkills, uploadResume } from "../api/client";
import { demoInput } from "../data/demoData";

const careerOptions = [
  "Data Scientist",
  "Web Developer",
  "AI Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst"
];

export default function SkillInputPage() {
  const navigate = useNavigate();
  const [career, setCareer] = useState(careerOptions[0]);
  const [skills, setSkills] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeSkills, setResumeSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your profile...");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = skills.split(",").pop()?.trim() || "";
    if (!token || token.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await suggestSkills(token);
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [skills]);

  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const data = await uploadResume(file);
      setResumeText(data.resumeText || "");
      setResumeSkills(data.extractedSkills || []);
    } catch (err) {
      setError(err?.response?.data?.error || "Resume processing failed.");
    }
  };

  const runAnalysis = async () => {
    setError("");
    setLoading(true);
    setLoadingProgress(4);
    setLoadingMessage("Queued. Preparing your analysis...");
    try {
      const { jobId } = await startAnalysisJob({ career, skills, resumeText });
      const deadline = Date.now() + 120000;

      while (Date.now() < deadline) {
        const job = await getJobStatus(jobId);
        setLoadingProgress(job.progress || 0);
        setLoadingMessage(job.message || "Processing...");
        if (job.status === "completed" && job.result) {
          localStorage.setItem("skillpath_result", JSON.stringify(job.result));
          navigate("/results", { state: job.result });
          return;
        }
        if (job.status === "failed") {
          throw new Error(job.message || "Analysis job failed.");
        }
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      throw new Error("Job timed out. Please try again.");
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Unable to complete analysis.");
    } finally {
      setLoading(false);
    }
  };

  const addSuggestedSkill = (skill) => {
    const existing = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (existing.some((s) => s.toLowerCase() === skill.toLowerCase())) return;
    const next = existing.concat(skill).join(", ");
    setSkills(next);
    setSuggestions([]);
  };

  return (
    <Layout>
      {loading && <LoadingOverlay message={loadingMessage} progress={loadingProgress} />}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 md:p-8"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold">Skill Input Studio</h1>
            <p className="text-sm text-[var(--muted)]">
              Add your known skills and optionally upload your resume.
            </p>
          </div>
          <button
            onClick={() => {
              setCareer(demoInput.career);
              setSkills(demoInput.skills);
              setResumeText("");
              setResumeSkills([]);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/65 px-3 py-2 text-sm font-medium transition hover:brightness-95 dark:bg-white/5"
          >
            <FlaskConical size={15} />
            Sample demo data
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Target Career</span>
            <select
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-full rounded-2xl border border-white/35 bg-white/70 p-3 outline-none dark:bg-white/5"
            >
              {careerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-2">
            <span className="text-sm font-semibold">Upload Resume (PDF)</span>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/40 bg-white/60 p-3 text-sm dark:bg-white/5">
              <FileUp size={17} />
              <span>Select PDF file</span>
              <input type="file" accept=".pdf" className="hidden" onChange={onFileChange} />
            </label>
            {resumeSkills.length > 0 && (
              <p className="text-xs text-[var(--muted)]">
                Extracted: {resumeSkills.slice(0, 8).join(", ")}
                {resumeSkills.length > 8 ? "..." : ""}
              </p>
            )}
          </div>
        </div>

        <label className="mt-5 block space-y-2">
          <span className="text-sm font-semibold">Current Skills</span>
          <textarea
            rows={7}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full rounded-2xl border border-white/35 bg-white/70 p-4 outline-none dark:bg-white/5"
            placeholder="Example: Python, SQL, React, Docker..."
          />
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/30 bg-white/50 p-3 dark:bg-white/5">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => addSuggestedSkill(item)}
                  className="rounded-full bg-[var(--brand)]/15 px-3 py-1 text-xs font-semibold transition hover:bg-[var(--brand)] hover:text-white"
                >
                  + {item}
                </button>
              ))}
            </div>
          )}
        </label>

        {error && (
          <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--brand)] px-6 py-3 font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          <Sparkles size={17} />
          Analyze & Generate Roadmap
        </button>
      </motion.section>
    </Layout>
  );
}
