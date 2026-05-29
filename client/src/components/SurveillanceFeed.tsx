import { AlertTriangle, RadioTower } from "lucide-react";
import { useEffect, useState } from "react";
import type { Scenario } from "../lib/api";

const SYSTEM_ALERTS = [
  "SUBJECT RESPONSE LOGGED",
  "MORALITY INDEX UNSTABLE",
  "EVIDENCE ARCHIVED",
  "SURVEILLANCE ACTIVE",
  "CLASSIFIED FILE OPEN",
  "AUDIO TRACE DEGRADED"
];

type SurveillanceFeedProps = {
  scenario?: Scenario;
  alertSeed: number;
};

export function SurveillanceFeed({ scenario, alertSeed }: SurveillanceFeedProps) {
  const [timestamp, setTimestamp] = useState(() => new Date());
  const alert = SYSTEM_ALERTS[alertSeed % SYSTEM_ALERTS.length];

  useEffect(() => {
    const timer = window.setInterval(() => setTimestamp(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {[0, 1, 2].map((cameraIndex) => (
        <div key={cameraIndex} className="camera-panel min-h-[118px] p-3">
          <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">
            <span>Cam {String(cameraIndex + 1).padStart(2, "0")}</span>
            <span className="text-blood-500">Rec</span>
          </div>
          <div className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-300">
            {cameraIndex === 0 && (scenario?.title ?? "No active room")}
            {cameraIndex === 1 && timestamp.toLocaleTimeString()}
            {cameraIndex === 2 && "Classified / Internal"}
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/80">
            {cameraIndex === 1 ? <RadioTower size={13} /> : <AlertTriangle size={13} />}
            {cameraIndex === 2 ? alert : "Signal monitored"}
          </div>
        </div>
      ))}
    </section>
  );
}
