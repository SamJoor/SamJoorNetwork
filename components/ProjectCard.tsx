import { useEffect, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function ProjectCard({
  title,
  blurb,
  tags = [],
  progress = 0,
  status,
  href,
}: {
  title: string;
  blurb: string;
  tags?: string[];
  progress?: number; // 0..100
  status?: string;
  href?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({ width: `${pct}%` });
  }, [pct, controls]);

  const progressColor = useMemo(() => {
    if (pct < 34) return "bg-red-500";
    if (pct < 67) return "bg-yellow-500";
    return "bg-emerald-500";
  }, [pct]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group relative flex h-full flex-col justify-between rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900"
    >
      <div className="space-y-3">
        <header className="flex items-start justify-between gap-4">
          {href ? (
            <a href={href} className="focus:outline-none">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100">
                {title}
              </h3>
            </a>
          ) : (
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
          )}
          <span
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            title={`${pct}% complete`}
          >
            {pct}%
          </span>
        </header>

        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {blurb}
        </p>

        {status && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">Current status:</span> {status}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 select-none" aria-label="Project progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <motion.div
            className={`h-2 ${progressColor}`}
            initial={{ width: 0 }}
            animate={controls}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
          <span>{pct < 100 ? "In progress" : "Complete"}</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
      </div>
    </motion.article>
  );
}
