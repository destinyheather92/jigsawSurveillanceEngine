import type { Attempt, DecisionResult, Outcome } from "./api";
// this is the psychological profiling system that sits on top of the  Jigsaw engine.

//this is basically a psychological report card 
//This code acts like a psychological profiler for the game. Instead of only deciding whether a player survives, dies, or escapes, it keeps track of all of their decisions and looks for patterns in their behavior. It analyzes things like whether the player tends to act selfishly, sacrifice themselves for others, think logically, hesitate under pressure, or make impulsive choices. Using those patterns, it builds a "subject profile" that assigns ratings for survival ability, morality, fear response, and overall risk level. In other words, it's the part of the game that studies the player over time and creates a Jigsaw-style case file describing what kind of person they are based on the choices they've made throughout the traps.
export type SubjectProfile = {
  id: string;
  riskLevel: string;
  survivalScore: number;
  moralityScore: number;
  fearResponse: number;
  complianceRating: number;
  strongestTrait: string;
  weakestTrait: string;
};

export type PatternScores = {
  selfishness: number;
  hesitation: number;
  sacrifice: number;
  logic: number;
  fear: number;
  impulse: number;
  empathy: number;
};

const TRAIT_LABELS: Record<keyof PatternScores, string> = {
  selfishness: "Self-preservation",
  hesitation: "Hesitation",
  sacrifice: "Sacrifice",
  logic: "Logic",
  fear: "Fear",
  impulse: "Impulse",
  empathy: "Empathy"
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function choiceText(attempt: Pick<Attempt, "choice">) {
  return attempt.choice.toLowerCase();
}

export function createSubjectId() {
  return `SUB-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-4)}`;
}

export function classifyMorality(moralScore: number) {
  if (moralScore >= 78) {
    return "Empathic resistance";
  }

  if (moralScore >= 58) {
    return "Conditional conscience";
  }

  if (moralScore >= 36) {
    return "Compromised morality";
  }

  return "Predatory self-preservation";
}

export function verdictForOutcome(outcome: Outcome) {
  if (outcome === "escaped") {
    return "Survival candidate";
  }

  if (outcome === "survived") {
    return "Requires further testing";
  }

  return "Case closed";
}

export function consequenceFor(result: DecisionResult) {
  if (result.outcome === "escaped") {
    return result.moralScore >= 65
      ? "Exit route opened; conscience retained under pressure."
      : "Exit route opened; ethical record remains contaminated.";
  }

  if (result.outcome === "survived") {
    return result.moralScore >= 50
      ? "Mechanism paused; subject remains viable for observation."
      : "Mechanism paused; trust index damaged by survival tactics.";
  }

  return result.moralScore >= 60
    ? "Subject failed despite cooperative moral posture."
    : "Subject failed after prioritizing motion over judgment.";
}

export function surviveRating(result: DecisionResult) {
  const rating = clamp(result.survivalScore * 0.72 + result.moralScore * 0.28);

  if (rating >= 82) {
    return "Likely to survive";
  }

  if (rating >= 58) {
    return "Unstable but viable";
  }

  if (rating >= 36) {
    return "Critical risk";
  }

  return "Unlikely to survive";
}

export function alternateOutcomePreview(
  result: DecisionResult,
  scenarioChoices: string[] = [],
  selectedChoice: string
) {
  const alternateChoice = scenarioChoices.find((choice) => choice !== selectedChoice);

  if (!alternateChoice) {
    return "No alternate decision path remains in the active file.";
  }

  if (result.moralScore < 45) {
    return `Had you chosen "${alternateChoice}", the engine predicts a cleaner record with a lower survival margin.`;
  }

  if (result.survivalScore < 45) {
    return `Had you chosen "${alternateChoice}", the engine predicts higher physical survival with heavier moral debt.`;
  }

  return `Had you chosen "${alternateChoice}", the engine predicts a comparable outcome with a different psychological signature.`;
}

export function calculatePatterns(attempts: Attempt[]): PatternScores {
  const scores: PatternScores = {
    selfishness: 0,
    hesitation: 0,
    sacrifice: 0,
    logic: 0,
    fear: 0,
    impulse: 0,
    empathy: 0
  };

  attempts.forEach((attempt) => {
    const text = choiceText(attempt);

    if (attempt.survivalScore > attempt.moralScore + 15) {
      scores.selfishness += 18;
    }

    if (attempt.moralScore > attempt.survivalScore + 15) {
      scores.empathy += 16;
      scores.sacrifice += 10;
    }

    if (text.includes("wait") || text.includes("confess") || text.includes("truth")) {
      scores.hesitation += 18;
      scores.empathy += 8;
    }

    if (text.includes("sacrifice") || text.includes("share air")) {
      scores.sacrifice += 26;
      scores.empathy += 18;
    }

    if (text.includes("solve") || text.includes("key") || text.includes("pattern")) {
      scores.logic += 26;
    }

    if (text.includes("violently") || text.includes("smashing") || text.includes("immediately")) {
      scores.impulse += 24;
      scores.fear += 12;
    }

    if (attempt.outcome === "died") {
      scores.fear += 14;
    }
  });

  return {
    selfishness: clamp(scores.selfishness),
    hesitation: clamp(scores.hesitation),
    sacrifice: clamp(scores.sacrifice),
    logic: clamp(scores.logic),
    fear: clamp(scores.fear),
    impulse: clamp(scores.impulse),
    empathy: clamp(scores.empathy)
  };
}

export function buildSubjectProfile(subjectId: string, attempts: Attempt[]): SubjectProfile {
  const survivalScore = clamp(average(attempts.map((attempt) => attempt.survivalScore)));
  const moralityScore = clamp(average(attempts.map((attempt) => attempt.moralScore)));
  const failedCount = attempts.filter((attempt) => attempt.outcome === "died").length;
  const fearResponse = clamp(28 + failedCount * 18 + attempts.length * 4 - survivalScore * 0.18);
  const complianceRating = clamp(moralityScore * 0.64 + survivalScore * 0.22);
  const riskIndex = clamp(100 - survivalScore * 0.48 - moralityScore * 0.3 + fearResponse * 0.22);
  const patterns = calculatePatterns(attempts);
  const rankedTraits = Object.entries(patterns).sort((a, b) => b[1] - a[1]) as Array<
    [keyof PatternScores, number]
  >;

  return {
    id: subjectId,
    riskLevel: riskIndex >= 70 ? "Extreme" : riskIndex >= 48 ? "Elevated" : "Contained",
    survivalScore,
    moralityScore,
    fearResponse,
    complianceRating,
    strongestTrait: TRAIT_LABELS[rankedTraits[0]?.[0] ?? "fear"],
    weakestTrait: TRAIT_LABELS[rankedTraits[rankedTraits.length - 1]?.[0] ?? "empathy"]
  };
}

export function caseSummary(attempt: Attempt, index: number) {
  const caseNumber = String(index + 1).padStart(3, "0");
  const classification = classifyMorality(attempt.moralScore).toLowerCase();

  return `Case #${caseNumber} - Subject chose ${classification} in ${attempt.scenarioTitle}.`;
}
