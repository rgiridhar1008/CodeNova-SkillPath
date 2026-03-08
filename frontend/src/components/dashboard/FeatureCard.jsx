import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-3xl p-6 shadow-md transition"
    >
      <div className="inline-flex rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-3">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 font-heading text-2xl font-semibold">{feature.title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{feature.description}</p>
      <Link
        to={feature.path || `/features/${feature.id}`}
        className="mt-5 inline-block rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
      >
        Open
      </Link>
    </motion.article>
  );
}
