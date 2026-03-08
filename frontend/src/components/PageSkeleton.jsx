export default function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="glass-card animate-pulse rounded-3xl p-6">
        <div className="h-6 w-52 rounded bg-white/45 dark:bg-white/10" />
        <div className="mt-3 h-4 w-80 rounded bg-white/35 dark:bg-white/10" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card animate-pulse rounded-3xl p-6">
          <div className="h-40 rounded bg-white/35 dark:bg-white/10" />
        </div>
        <div className="glass-card animate-pulse rounded-3xl p-6">
          <div className="h-40 rounded bg-white/35 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
