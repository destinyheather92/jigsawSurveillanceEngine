import { motion } from "framer-motion";
import { Database, FileWarning } from "lucide-react";
import type { Attempt } from "../lib/api";
import { verdictForOutcome } from "../lib/analysis";

type HistoryScreenProps = {
  attempts: Attempt[];
};

const outcomeClass = {
  survived: "text-gray-100",
  died: "text-blood-500",
  escaped: "text-emerald-200"
};

export function HistoryScreen({ attempts }: HistoryScreenProps) {
  return (
    <motion.section
      className="terminal-panel p-5 sm:p-7"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/80">
            <Database size={16} />
            Persistent evidence
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-[0.16em] text-gray-100 sm:text-7xl">
            Case File Archive
          </h1>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-gray-500">
          {attempts.length} classified records indexed
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="mt-8 flex items-center gap-3 border border-blood-500/25 bg-black/45 p-5 font-mono text-sm text-gray-400">
          <FileWarning className="text-blood-500" size={20} />
          No stored judgments. The archive is waiting.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-white/10">
          <table className="w-full min-w-[980px] border-collapse bg-black/45 font-mono text-sm">
            <thead>
              <tr className="border-b border-blood-500/30 text-left text-[10px] uppercase tracking-[0.24em] text-gray-500">
                <th className="px-4 py-3">Case</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Verdict</th>
                <th className="px-4 py-3">Survival</th>
                <th className="px-4 py-3">Moral</th>
                <th className="px-4 py-3">Choice</th>
                <th className="px-4 py-3">Judgment</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr
                  key={attempt.id}
                  className="border-b border-white/10 text-gray-300 transition hover:bg-blood-500/10"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-xs uppercase tracking-[0.2em] text-blood-400">
                    #{String(attempts.length - index).padStart(3, "0")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-500">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 uppercase tracking-[0.08em]">
                    {attempt.scenarioTitle}
                  </td>
                  <td
                    className={`px-4 py-4 uppercase tracking-[0.16em] ${
                      outcomeClass[attempt.outcome]
                    }`}
                  >
                    {verdictForOutcome(attempt.outcome)}
                  </td>
                  <td className="px-4 py-4">{attempt.survivalScore}</td>
                  <td className="px-4 py-4">{attempt.moralScore}</td>
                  <td className="max-w-[340px] px-4 py-4 text-gray-400">
                    {attempt.choice}
                  </td>
                  <td className="max-w-[360px] px-4 py-4 text-gray-500">
                    {attempt.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
}
