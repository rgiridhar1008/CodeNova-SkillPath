import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { dashboardFeatures } from "../data/dashboardFeatures";

export default function FeatureDetailPage() {
  const { featureId } = useParams();
  const feature = useMemo(
    () => dashboardFeatures.find((item) => item.id === featureId),
    [featureId]
  );

  if (!feature) {
    return (
      <Layout>
        <div className="glass-card rounded-3xl p-6">
          <p className="font-heading text-xl font-semibold">Feature not found.</p>
          <Link to="/dashboard" className="mt-3 inline-block rounded-xl bg-[var(--brand)] px-4 py-2 text-white">
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = feature.icon;

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <div className="inline-flex rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-3">
            <Icon size={22} />
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold">{feature.title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{feature.description}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="glass-card rounded-3xl p-6">
            <p className="font-heading text-lg font-semibold">Inside This Page</p>
            <ul className="mt-3 space-y-2 text-sm">
              {feature.highlights.map((item) => (
                <li key={item} className="rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="glass-card rounded-3xl p-6">
            <p className="font-heading text-lg font-semibold">References</p>
            <ul className="mt-3 space-y-2 text-sm">
              {feature.references.map((ref) => (
                <li key={ref.label}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl bg-white/55 px-3 py-2 transition hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </Layout>
  );
}
