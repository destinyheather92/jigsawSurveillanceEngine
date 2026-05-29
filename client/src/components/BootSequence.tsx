import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type BootSequenceProps = {
  onComplete: () => void;
};

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [progress, setProgress] = useState(0);
  const lines = useMemo(
    () => [
      "INITIALIZING SURVEILLANCE SYSTEM...",
      "LOADING SUBJECT PROFILE...",
      "LINKING LOCAL EVIDENCE DATABASE...",
      "ARMING MORALITY ENGINE..."
    ],
    []
  );

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(current + Math.random() * 18 + 5, 100));
    }, 180);
    const doneTimer = window.setTimeout(onComplete, 2700);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] text-gray-200"
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.55 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(209,23,23,0.14),transparent_34%)]" />
      <div className="absolute inset-0 scanline-overlay" />
      <div className="relative w-[min(620px,88vw)] border border-blood-500/40 bg-black/70 p-6 shadow-red-hard">
        <p className="font-display text-4xl uppercase tracking-[0.2em] text-blood-500 sm:text-6xl">
          JIGSAW
        </p>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.5em] text-gray-500">
          Surveillance Engine
        </p>

        <div className="mt-8 space-y-3 font-mono text-sm text-gray-300">
          {lines.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.34 }}
              className="glitch-text"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <div className="mt-8 h-3 border border-blood-500/35 bg-black">
          <motion.div
            className="h-full bg-blood-600 shadow-[0_0_18px_rgba(209,23,23,0.72)]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.18 }}
          />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.26em] text-gray-500">
          <span>Signal locked</span>
          <span>{Math.floor(progress).toString().padStart(3, "0")}%</span>
        </div>
      </div>
    </motion.div>
  );
}
