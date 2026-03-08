import { motion } from "framer-motion";

export default function LoadingOverlay({
  message = "Analyzing your profile...",
  progress = 0
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-[90%] max-w-md rounded-3xl p-8 text-center"
      >
        <motion.div
          className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-white/35 border-t-[var(--brand)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1.05 }}
        />
        <p className="font-heading text-xl font-semibold">{message}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This may take a few seconds while AI builds your roadmap.
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/30">
          <motion.div
            className="h-full rounded-full bg-[var(--brand)]"
            animate={{ width: `${Math.max(5, Math.min(100, Number(progress || 0)))}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">{Math.round(progress || 0)}% complete</p>
      </motion.div>
    </div>
  );
}
