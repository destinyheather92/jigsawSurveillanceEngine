import { motion } from "framer-motion";
import { Crosshair, RefreshCw } from "lucide-react";
import type { Scenario } from "../lib/api";

type ScenarioScreenProps = {
  scenario?: Scenario;
  scenarioIndex: number;
  totalScenarios: number;
  isBusy: boolean;
  onDecision: (choice: string) => void;
  onNextScenario: () => void;
};

export function ScenarioScreen({
  scenario,
  scenarioIndex,
  totalScenarios,
  isBusy,
  onDecision,
  onNextScenario
}: ScenarioScreenProps) {
  if (!scenario) {
    return (
      <section className="terminal-panel mx-auto max-w-4xl p-8">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-blood-500">
          No scenario signal detected
        </p>
      </section>
    );
  }

  return (
    <motion.section
      className="terminal-panel mx-auto grid max-w-6xl gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_360px]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">
          <span>Trap feed {String(scenarioIndex + 1).padStart(2, "0")}</span>
          <span>{totalScenarios} live rooms</span>
          <span className="text-blood-500">Choice required</span>
        </div>

        <h1 className="glitch-heading font-display text-5xl uppercase tracking-[0.15em] text-gray-100 sm:text-7xl">
          {scenario.title}
        </h1>

        <p className="mt-6 max-w-3xl font-mono text-sm leading-7 text-gray-300 sm:text-base">
          {scenario.description}
        </p>
      </div>

      <aside className="border border-blood-500/25 bg-black/55 p-4 shadow-red-glow">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-display text-2xl uppercase tracking-[0.16em] text-gray-200">
            Decision Input
          </p>
          <button
            className="icon-command"
            type="button"
            onClick={onNextScenario}
            aria-label="Cycle scenario feed"
            title="Cycle feed"
            disabled={isBusy}
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {scenario.choices.map((choice, index) => (
            <motion.button
              key={choice}
              className="choice-button group"
              type="button"
              onClick={() => onDecision(choice)}
              disabled={isBusy}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-blood-500/35 bg-black font-mono text-xs text-blood-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-left">{choice}</span>
              <Crosshair
                size={17}
                className="shrink-0 text-blood-500 opacity-50 transition group-hover:opacity-100"
              />
            </motion.button>
          ))}
        </div>
      </aside>
    </motion.section>
  );
}
