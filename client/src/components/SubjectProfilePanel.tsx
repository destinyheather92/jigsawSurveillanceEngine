import { Fingerprint, ShieldAlert } from "lucide-react";
import type { SubjectProfile } from "../lib/analysis";
import { MeterBar } from "./MeterBar";

type SubjectProfilePanelProps = {
  profile: SubjectProfile;
  recordCount: number;
};

export function SubjectProfilePanel({ profile, recordCount }: SubjectProfilePanelProps) {
  return (
    <aside className="terminal-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300/80">
            <Fingerprint size={14} />
            Subject profile
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.16em] text-gray-100">
            {profile.id}
          </h2>
        </div>
        <span className="border border-blood-500/40 bg-blood-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-blood-400">
          {profile.riskLevel}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <MeterBar label="Survival score" value={profile.survivalScore} tone="red" />
        <MeterBar label="Morality score" value={profile.moralityScore} tone="amber" />
        <MeterBar label="Fear response" value={profile.fearResponse} tone="red" />
        <MeterBar label="Compliance rating" value={profile.complianceRating} tone="amber" />
      </div>

      <div className="mt-5 grid gap-3 border border-white/10 bg-black/45 p-3 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
        <p className="flex items-center gap-2 text-blood-400">
          <ShieldAlert size={14} />
          Records linked: {recordCount}
        </p>
        <p>Strongest trait: {profile.strongestTrait}</p>
        <p>Weakest trait: {profile.weakestTrait}</p>
      </div>
    </aside>
  );
}
