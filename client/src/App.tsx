import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import surveillanceRoom from "./assets/surveillance-room.png";
import { BootSequence } from "./components/BootSequence";
import { CaseTimeline } from "./components/CaseTimeline";
import { HistoryScreen } from "./components/HistoryScreen";
import { PatternAnalysisPanel } from "./components/PatternAnalysisPanel";
import { ResultScreen } from "./components/ResultScreen";
import { ScenarioScreen } from "./components/ScenarioScreen";
import { SubjectProfilePanel } from "./components/SubjectProfilePanel";
import { SystemHeader } from "./components/SystemHeader";
import { SurveillanceFeed } from "./components/SurveillanceFeed";
import {
  Attempt,
  DecisionResult,
  Scenario,
  fetchHistory,
  fetchScenarios,
  submitDecision
} from "./lib/api";
import { buildSubjectProfile, createSubjectId } from "./lib/analysis";

type View = "scenario" | "result" | "history";

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [view, setView] = useState<View>("scenario");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [currentRunAttempts, setCurrentRunAttempts] = useState<Attempt[]>([]);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [subjectId, setSubjectId] = useState(() => {
    const storedId = window.localStorage.getItem("jigsaw-subject-id");

    if (storedId) {
      return storedId;
    }

    const nextId = createSubjectId();
    window.localStorage.setItem("jigsaw-subject-id", nextId);
    return nextId;
  });
  const [isBusy, setIsBusy] = useState(false);
  const [redFlash, setRedFlash] = useState(false);
  const [error, setError] = useState("");

  const activeScenario = scenarios[scenarioIndex];
  const trialCount = attempts.length;
  const subjectProfile = useMemo(
    () => buildSubjectProfile(subjectId, currentRunAttempts),
    [currentRunAttempts, subjectId]
  );

  const loadHistory = useCallback(async () => {
    const history = await fetchHistory();
    setAttempts(history.attempts);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [scenarioData, historyData] = await Promise.all([
          fetchScenarios(),
          fetchHistory()
        ]);

        if (!isMounted) {
          return;
        }

        setScenarios(scenarioData.scenarios);
        setAttempts(historyData.attempts);
      } catch (currentError) {
        if (isMounted) {
          setError(
            currentError instanceof Error
              ? currentError.message
              : "Surveillance uplink failed"
          );
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextScenario = useCallback(() => {
    setScenarioIndex((current) => (scenarios.length ? (current + 1) % scenarios.length : 0));
    setView("scenario");
    setResult(null);
    setSelectedChoice("");
  }, [scenarios.length]);

  const startNewSubject = useCallback(() => {
    const nextId = createSubjectId();
    window.localStorage.setItem("jigsaw-subject-id", nextId);
    setSubjectId(nextId);
    setCurrentRunAttempts([]);
    setScenarioIndex(0);
    setView("scenario");
    setResult(null);
    setSelectedChoice("");
    setError("");
  }, []);

  const decide = useCallback(
    async (choice: string) => {
      if (!activeScenario || isBusy) {
        return;
      }

      setError("");
      setSelectedChoice(choice);
      setRedFlash(true);
      setIsBusy(true);
      const delay = 500 + Math.random() * 700;
      const startedAt = performance.now();

      try {
        const judgment = await submitDecision(activeScenario.id, choice);
        const elapsed = performance.now() - startedAt;
        await sleep(Math.max(0, delay - elapsed));

        const localAttempt: Attempt = {
          id: `local-${Date.now()}`,
          scenarioId: activeScenario.id,
          scenarioTitle: activeScenario.title,
          choice,
          outcome: judgment.outcome,
          survivalScore: judgment.survivalScore,
          moralScore: judgment.moralScore,
          message: judgment.jigsawMessage,
          createdAt: new Date().toISOString()
        };

        setCurrentRunAttempts((current) => [localAttempt, ...current]);
        setResult(judgment);
        setView("result");
        await loadHistory();
      } catch (currentError) {
        setError(
          currentError instanceof Error ? currentError.message : "Decision engine rejected input"
        );
      } finally {
        setIsBusy(false);
        window.setTimeout(() => setRedFlash(false), 180);
      }
    },
    [activeScenario, isBusy, loadHistory]
  );

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(90deg, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.84) 42%, rgba(5,5,5,0.54) 100%), url(${surveillanceRoom})`
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100">
      <AnimatePresence>
        {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      </AnimatePresence>

      <div className="fixed inset-0 bg-cover bg-center opacity-70" style={backgroundStyle} />
      <div className="pointer-events-none fixed inset-0 scanline-overlay" />
      <div className="pointer-events-none fixed inset-0 noise-overlay" />
      <motion.div
        className="pointer-events-none fixed inset-0 z-40 bg-blood-600 mix-blend-screen"
        initial={false}
        animate={{ opacity: redFlash ? 0.24 : 0 }}
        transition={{ duration: 0.12 }}
      />

      {bootComplete && (
        <div className="relative z-10 min-h-screen">
          <SystemHeader
            trialCount={trialCount}
            activeView={view}
            onOpenHistory={() => setView("history")}
            onOpenScenario={() => setView(result ? "result" : "scenario")}
            onNewSubject={startNewSubject}
          />

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {error && (
              <div className="mx-auto mb-5 max-w-5xl border border-blood-500/40 bg-black/70 p-4 font-mono text-sm text-blood-500 shadow-red-glow">
                {error}
              </div>
            )}

            <div className="mb-6">
              <SurveillanceFeed scenario={activeScenario} alertSeed={trialCount + scenarioIndex} />
            </div>

            <AnimatePresence mode="wait">
              {view === "scenario" && (
                <motion.div
                  key="scenario"
                  className="grid gap-6 lg:grid-cols-[320px_1fr]"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="space-y-6">
                    <SubjectProfilePanel
                      profile={subjectProfile}
                      recordCount={currentRunAttempts.length}
                    />
                    <CaseTimeline attempts={currentRunAttempts} />
                  </div>
                  <ScenarioScreen
                    scenario={activeScenario}
                    scenarioIndex={scenarioIndex}
                    totalScenarios={scenarios.length}
                    isBusy={isBusy}
                    onDecision={decide}
                    onNextScenario={nextScenario}
                  />
                </motion.div>
              )}

              {view === "result" && result && (
                <ResultScreen
                  key="result"
                  result={result}
                  scenario={activeScenario}
                  choice={selectedChoice}
                  subjectProfile={subjectProfile}
                  onContinue={nextScenario}
                  onHistory={() => setView("history")}
                />
              )}

              {view === "history" && (
                <motion.div
                  key="history"
                  className="grid gap-6 lg:grid-cols-[1fr_360px]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <HistoryScreen attempts={attempts} />
                  <div className="space-y-6">
                    <SubjectProfilePanel
                      profile={subjectProfile}
                      recordCount={currentRunAttempts.length}
                    />
                    <PatternAnalysisPanel attempts={currentRunAttempts} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <AnimatePresence>
            {isBusy && (
              <motion.div
                className="fixed inset-0 z-30 flex items-center justify-center bg-black/78 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="border border-blood-500/40 bg-black/85 p-6 text-center shadow-red-hard">
                  <p className="glitch-heading font-display text-5xl uppercase tracking-[0.16em] text-blood-500">
                    Analyzing Subject
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
                    Decision stored pending judgment
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default App;
