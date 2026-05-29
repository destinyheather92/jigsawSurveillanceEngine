import { motion } from "framer-motion";
import { Archive, FileText, RotateCcw } from "lucide-react";
import { useTypewriter } from "../hooks/useTypewriter";
import {
  alternateOutcomePreview,
  classifyMorality,
  consequenceFor,
  SubjectProfile,
  surviveRating,
  verdictForOutcome
} from "../lib/analysis";
import type { DecisionResult, Scenario } from "../lib/api";
import { MeterBar } from "./MeterBar";

type ResultScreenProps = {
  result: DecisionResult;
  scenario?: Scenario;
  choice: string;
  subjectProfile: SubjectProfile;
  onContinue: () => void;
  onHistory: () => void;
};

const outcomeCopy = {
  survived: "SURVIVED",
  died: "SUBJECT LOST",
  escaped: "ESCAPED"
};

export function ResultScreen({
  result,
  scenario,
  choice,
  subjectProfile,
  onContinue,
  onHistory
}: ResultScreenProps) {
  const typedMessage = useTypewriter(result.jigsawMessage, 22);
  const isDeath = result.outcome === "died";
  const decisionScore = Math.round(result.survivalScore * 0.62 + result.moralScore * 0.38);

  return (
    <motion.section
      className="terminal-panel mx-auto max-w-5xl p-5 sm:p-8"
      initial={{ opacity: 0, backgroundColor: "rgba(0,0,0,1)" }}
      animate={
        isDeath
          ? { opacity: 1, x: [0, -5, 4, -2, 2, 0] }
          : { opacity: 1, x: 0 }
      }
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.34em] text-gray-500">
        <FileText size={15} className="text-blood-500" />
        Jigsaw judgment report / {subjectProfile.id}
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <h1
            className={`font-display text-6xl uppercase tracking-[0.16em] sm:text-8xl ${
              isDeath ? "text-blood-500" : "text-gray-100"
            }`}
          >
            {outcomeCopy[result.outcome]}
          </h1>
          <div className="mt-4 grid gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gray-500 sm:grid-cols-2">
            <span>Time to outcome: {result.timeToOutcome}</span>
            <span>Scenario: {scenario?.title ?? "Unknown room"}</span>
            <span>Decision score: {decisionScore}/100</span>
            <span>{surviveRating(result)}</span>
          </div>
          <p className="mt-5 border-l border-blood-500/50 pl-4 font-mono text-sm leading-7 text-gray-300">
            {typedMessage}
            <span className="animate-pulse text-blood-500">_</span>
          </p>

          <div className="mt-5 grid gap-3 font-mono text-xs uppercase tracking-[0.18em] text-gray-400 sm:grid-cols-2">
            <div className="border border-white/10 bg-black/45 p-3">
              <p className="text-gray-600">Moral classification</p>
              <p className="mt-2 text-amber-100">{classifyMorality(result.moralScore)}</p>
            </div>
            <div className="border border-white/10 bg-black/45 p-3">
              <p className="text-gray-600">Would you survive?</p>
              <p className="mt-2 text-blood-400">{surviveRating(result)}</p>
            </div>
            <div className="border border-white/10 bg-black/45 p-3 sm:col-span-2">
              <p className="text-gray-600">Consequence</p>
              <p className="mt-2 leading-5 text-gray-300">{consequenceFor(result)}</p>
            </div>
            <div className="border border-amber-200/20 bg-black/45 p-3 sm:col-span-2">
              <p className="text-gray-600">Alternate outcome preview</p>
              <p className="mt-2 leading-5 text-amber-100">
                {alternateOutcomePreview(result, scenario?.choices, choice)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 border border-white/10 bg-black/45 p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">
              Recorded choice
            </p>
            <p className="mt-2 font-mono text-sm leading-6 text-gray-300">{choice}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">
              Verdict
            </p>
            <p className="mt-2 font-display text-3xl uppercase tracking-[0.14em] text-blood-400">
              {verdictForOutcome(result.outcome)}
            </p>
          </div>
          <MeterBar label="Survival" value={result.survivalScore} tone="red" />
          <MeterBar label="Moral" value={result.moralScore} tone="amber" />
          <MeterBar label="Decision" value={decisionScore} tone="red" />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button className="command-button" type="button" onClick={onContinue}>
          <RotateCcw size={18} />
          Next trial
        </button>
        <button className="command-button secondary" type="button" onClick={onHistory}>
          <Archive size={18} />
          Case archive
        </button>
      </div>
    </motion.section>
  );
}
