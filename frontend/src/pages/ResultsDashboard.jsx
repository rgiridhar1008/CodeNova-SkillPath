import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Lightbulb } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import MatchChart from "../components/MatchChart";
import RoadmapTimeline from "../components/RoadmapTimeline";
import { downloadReport } from "../api/client";

export default function ResultsDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = useMemo(() => {
    if (location.state?.analysis) return location.state;
    const cached = localStorage.getItem("skillpath_result");
    return cached ? JSON.parse(cached) : null;
  }, [location.state]);

  if (!result?.analysis) {
    return (
      <Layout>
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="font-heading text-2xl font-semibold">No analysis found</p>
          <p className="mt-2 text-[var(--muted)]">
            Run an analysis first to view your dashboard.
          </p>
          <button
            onClick={() => navigate("/skill-analyzer")}
            className="mt-4 rounded-xl bg-[var(--brand)] px-5 py-2 text-white"
          >
            Go to Skill Input
          </button>
        </div>
      </Layout>
    );
  }

  const { analysis, roadmap } = result;

  return (
    <Layout>
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-3xl p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Career Target</p>
            <h1 className="font-heading text-3xl font-bold">{analysis.career}</h1>
          </div>
          <button
            onClick={() => downloadReport({ analysis, roadmap })}
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--brand)] px-5 py-3 font-semibold text-white transition hover:brightness-110"
          >
            <Download size={17} />
            Download PDF Report
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <MatchChart value={analysis.skillMatchPercentage} />

          <div className="glass-card rounded-3xl p-6 lg:col-span-2">
            <p className="font-heading text-lg font-semibold">Missing Skills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.missingSkills?.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/35 bg-white/70 px-3 py-1 text-xs font-semibold dark:bg-white/5"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-4 font-heading text-lg font-semibold">Strength Areas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {analysis.strengthAreas?.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <RoadmapTimeline roadmap={roadmap} />

        <div className="glass-card rounded-3xl p-6">
          <p className="font-heading text-lg font-semibold">Course Recommendations</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {analysis.recommendedCourses?.map((course) => (
              <a
                key={course.title}
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-white/30 bg-white/60 p-4 transition hover:-translate-y-1 hover:shadow-glow dark:bg-white/5"
              >
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  <BookOpen size={14} />
                  {course.provider}
                </p>
                <p className="mt-2 font-heading text-base font-semibold">{course.title}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="inline-flex items-center gap-2 font-heading text-lg font-semibold">
            <Lightbulb size={18} />
            Suggested Projects
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {roadmap?.projects?.map((project) => (
              <li key={project}>• {project}</li>
            ))}
          </ul>
        </div>
      </motion.section>
    </Layout>
  );
}
