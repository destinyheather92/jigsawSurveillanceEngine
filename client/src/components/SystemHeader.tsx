import { Archive, Database, Radio, RotateCcw, ScanLine, Terminal } from "lucide-react";

type SystemHeaderProps = {
  trialCount: number;
  activeView: "scenario" | "result" | "history";
  onOpenHistory: () => void;
  onOpenScenario: () => void;
  onNewSubject: () => void;
};

export function SystemHeader({
  trialCount,
  activeView,
  onOpenHistory,
  onOpenScenario,
  onNewSubject
}: SystemHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-blood-500/30 bg-black/80 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-gray-400 sm:text-xs">
          <span className="flex items-center gap-2 text-blood-500">
            <span className="h-2.5 w-2.5 rounded-full bg-blood-500 shadow-[0_0_14px_rgba(209,23,23,0.9)]" />
            Recording
          </span>
          <span className="flex items-center gap-2">
            <Radio size={14} className="text-gray-500" />
            Subject active
          </span>
          <span className="flex items-center gap-2 text-emerald-300/80">
            <Database size={14} />
            Database linked
          </span>
          <span className="flex items-center gap-2 text-amber-200/80">
            <ScanLine size={14} />
            Trial count: {trialCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`icon-command ${activeView !== "history" ? "is-active" : ""}`}
            type="button"
            onClick={onOpenScenario}
            aria-label="Return to active trial"
            title="Active trial"
          >
            <Terminal size={17} />
          </button>
          <button
            className={`icon-command ${activeView === "history" ? "is-active" : ""}`}
            type="button"
            onClick={onOpenHistory}
            aria-label="Open case file archive"
            title="Case file archive"
          >
            <Archive size={17} />
          </button>
          <button
            className="icon-command"
            type="button"
            onClick={onNewSubject}
            aria-label="Start new subject"
            title="Start new subject"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
