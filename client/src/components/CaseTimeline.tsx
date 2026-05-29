import { Clock3, FileLock2 } from "lucide-react";
import type { Attempt } from "../lib/api";
import { caseSummary, verdictForOutcome } from "../lib/analysis";

type CaseTimelineProps = {
  attempts: Attempt[];
};

export function CaseTimeline({ attempts }: CaseTimelineProps) {
  const recentAttempts = attempts.slice(0, 5);

  return (
    <section className="terminal-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-gray-400">
          <FileLock2 size={14} className="text-blood-500" />
          Case file timeline
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-600">
          Latest entries
        </span>
      </div>

      {recentAttempts.length === 0 ? (
        <p className="mt-4 border border-white/10 bg-black/45 p-3 font-mono text-xs uppercase tracking-[0.18em] text-gray-500">
          No recorded behavior. Awaiting first choice.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {recentAttempts.map((attempt, index) => (
            <li key={attempt.id} className="border-l border-blood-500/40 pl-3">
              <p className="font-mono text-xs leading-5 text-gray-300">
                {caseSummary(attempt, recentAttempts.length - index - 1)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Clock3 size={12} />
                  {new Date(attempt.createdAt).toLocaleTimeString()}
                </span>
                <span>{verdictForOutcome(attempt.outcome)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
