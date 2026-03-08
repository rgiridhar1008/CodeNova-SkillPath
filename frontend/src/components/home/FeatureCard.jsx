import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass-card group rounded-3xl p-6 shadow-lg transition"
    >
      <div className="inline-flex rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-3">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      <div className="mt-4 h-1 w-0 rounded bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 group-hover:w-16" />
    </motion.article>
  );
}
