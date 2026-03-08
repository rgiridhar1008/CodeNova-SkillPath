import { useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import Layout from "../components/Layout";
import { learningResources } from "../data/careerExplorerData";

export default function LearningHubPage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [bookmarks, setBookmarks] = useState([]);

  const items = useMemo(() => {
    return learningResources.filter((item) => {
      const typeOk = typeFilter === "All" || item.type === typeFilter;
      const platformOk = platformFilter === "All" || item.platform === platformFilter;
      return typeOk && platformOk;
    });
  }, [typeFilter, platformFilter]);

  const platforms = ["All", ...new Set(learningResources.map((i) => i.platform))];

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Learning Hub</h1>
          <p className="text-sm text-[var(--muted)]">
            Curated courses with free/paid filters and bookmark tracking.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-white/30 bg-white/65 p-3 dark:bg-white/5"
            >
              {["All", "Free", "Paid"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="rounded-xl border border-white/30 bg-white/65 p-3 dark:bg-white/5"
            >
              {platforms.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((course) => {
            const marked = bookmarks.includes(course.title);
            return (
              <article key={course.title} className="glass-card rounded-3xl p-5">
                <p className="text-xs uppercase tracking-[0.13em] text-[var(--muted)]">
                  {course.platform} • {course.type}
                </p>
                <h3 className="mt-2 font-heading text-lg font-semibold">{course.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{course.domain}</p>
                <button
                  type="button"
                  onClick={() =>
                    setBookmarks((prev) =>
                      marked ? prev.filter((b) => b !== course.title) : prev.concat(course.title)
                    )
                  }
                  className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    marked ? "bg-emerald-500/20" : "bg-white/60 dark:bg-white/10"
                  }`}
                >
                  <Bookmark size={15} />
                  {marked ? "Bookmarked" : "Bookmark"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
