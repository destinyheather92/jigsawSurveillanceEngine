import { motion } from "framer-motion";

// MeterBar is a small, reusable status indicator for values that are already
// normalized to a 0-100 range. It deliberately stays presentational: callers
// decide what the value means and which tone best matches the context.
type MeterBarProps = {
  // Short text shown above the meter. The surrounding UI uses all-caps,
  // letter-spaced labels, so callers can pass plain readable words here.
  label: string;
  // Completion/intensity value expressed as a percentage. The component does
  // not clamp the number so invalid data remains visible during development.
  value: number;
  // Visual severity style. Red reads as danger/pressure, while amber reads as
  // warning/energy without carrying the same critical weight.
  tone: "red" | "amber";
};

export function MeterBar({ label, value, tone }: MeterBarProps) {
  // Tailwind gradient stops are chosen from the limited set of supported tones
  // so the rendered class names remain static enough for Tailwind to include
  // them in the generated CSS bundle.
  const color =
    tone === "red"
      ? "from-blood-700 via-blood-500 to-red-300"
      : "from-amber-700 via-amber-400 to-yellow-100";

  return (
    <div>
      {/* Header row: pairs the human-friendly label with the raw numeric value
          so the bar can be scanned visually while still exposing exact data. */}
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.24em] text-gray-400">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      {/* Track container: overflow-hidden clips the animated fill to the meter
          bounds, and the black background keeps low values legible. */}
      <div className="h-4 overflow-hidden border border-white/10 bg-black">
        <motion.div
          // The fill inherits the selected tone gradient while keeping the same
          // glow treatment across tones for a consistent instrument-panel feel.
          className={`h-full bg-gradient-to-r ${color} shadow-[0_0_20px_rgba(209,23,23,0.32)]`}
          // Start empty on mount so changing screens/components gives users a
          // quick visual read of the current value instead of appearing static.
          initial={{ width: 0 }}
          // Width is driven directly by the normalized percentage value.
          animate={{ width: `${value}%` }}
          // A slightly long ease-out makes the meter feel mechanical and gives
          // the final value enough time to register without feeling sluggish.
          transition={{ duration: 1.15, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
