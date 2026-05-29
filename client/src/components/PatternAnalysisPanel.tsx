import { Activity } from "lucide-react";
import type { Attempt } from "../lib/api";
import { calculatePatterns } from "../lib/analysis";
import { MeterBar } from "./MeterBar";

type PatternAnalysisPanelProps = {
  attempts: Attempt[];
};

export function PatternAnalysisPanel({ attempts }: PatternAnalysisPanelProps) {
  const patterns = calculatePatterns(attempts);

  return (
    <section className="terminal-panel p-4">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-gray-400">
        <Activity size={14} className="text-emerald-300/80" />
        Psychological pattern analysis
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <MeterBar label="Selfishness" value={patterns.selfishness} tone="red" />
        <MeterBar label="Hesitation" value={patterns.hesitation} tone="amber" />
        <MeterBar label="Sacrifice" value={patterns.sacrifice} tone="amber" />
        <MeterBar label="Logic" value={patterns.logic} tone="amber" />
        <MeterBar label="Fear" value={patterns.fear} tone="red" />
        <MeterBar label="Impulse" value={patterns.impulse} tone="red" />
        <MeterBar label="Empathy" value={patterns.empathy} tone="amber" />
      </div>
    </section>
  );
}
