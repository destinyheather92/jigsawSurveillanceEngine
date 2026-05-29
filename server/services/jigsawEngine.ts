import type { Scenario } from "@prisma/client";
//This is the scoring engine it decides what happens after the player makes a choice. It takes into account the scenario, the choice, and some randomness to determine the outcome, survival score, moral score, time to outcome, and a message for the player. The scoring is based on heuristics and is designed to create a sense of consequence and variability in the game.
//So if the player choses something honest, they gain moral points but might lose survival points, if they choose something risky they might gain survival points but lose moral points, and so on. The outcome is determined by the final survival and moral scores, and the message is tailored to the outcome and the scores to give feedback to the player.
export type Outcome = "survived" | "died" | "escaped";

export type DecisionResult = {
  outcome: Outcome;
  survivalScore: number;
  moralScore: number;
  timeToOutcome: string;
  jigsawMessage: string;
};

type ScoreProfile = {
  survival: number;
  moral: number;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function difficultyMultiplier(scenario: Scenario) {
  const title = scenario.title.toLowerCase();

  if (title.includes("breath")) {
    return 0.76;
  }

  if (title.includes("glass")) {
    return 0.84;
  }

  if (title.includes("red door")) {
    return 0.92;
  }

  return 0.88;
}

function scoreChoice(choice: string): ScoreProfile {
  const normalized = choice.toLowerCase();
  const score: ScoreProfile = {
    survival: 42,
    moral: 50
  };

  if (normalized.includes("pull the lever")) {
    score.survival += 30;
    score.moral -= 20;
  }

  if (normalized.includes("wait")) {
    score.survival += 10;
    score.moral += 10;
  }

  if (normalized.includes("escape violently") || normalized.includes("smashing")) {
    score.survival += randomInt(-40, 40);
    score.moral -= 25;
  }

  if (normalized.includes("confess") || normalized.includes("truth")) {
    score.survival += 8;
    score.moral += 24;
  }

  if (normalized.includes("sacrifice") || normalized.includes("share air")) {
    score.survival -= 12;
    score.moral += 36;
  }

  if (normalized.includes("betray") || normalized.includes("another subject's name")) {
    score.survival += 18;
    score.moral -= 35;
  }

  if (normalized.includes("solve") || normalized.includes("hidden key") || normalized.includes("pattern")) {
    score.survival += 22;
    score.moral += 8;
  }

  if (normalized.includes("cut through") || normalized.includes("red door immediately")) {
    score.survival += 20;
    score.moral -= 15;
  }

  if (
    score.survival === 42 &&
    score.moral === 50
  ) {
    score.survival += randomInt(-10, 20);
    score.moral += randomInt(-5, 15);
  }

  return score;
}

function resolveOutcome(survivalScore: number, moralScore: number): Outcome {
  if (survivalScore >= 76 && moralScore >= 35) {
    return "escaped";
  }

  if (survivalScore >= 45) {
    return "survived";
  }

  return "died";
}

function messageFor(outcome: Outcome, survivalScore: number, moralScore: number) {
  if (outcome === "escaped") {
    return moralScore >= 70
      ? "The door opened because you understood the test. Survival without memory is only another locked room."
      : "You found the exit, but the archive keeps the parts of you that escaped last.";
  }

  if (outcome === "survived") {
    return moralScore < 35
      ? "You are alive. That is not the same as being absolved. The cameras saw what you traded."
      : "You endured the mechanism and kept enough of yourself to be measured again.";
  }

  return moralScore >= 70
    ? "Your intentions were clean. The machine was not built to reward intentions alone."
    : "The subject confused motion with will. The record is closed, but the lesson remains open.";
}

export function evaluateDecision(scenario: Scenario, choice: string): DecisionResult {
  const baseScore = scoreChoice(choice);
  const multiplier = difficultyMultiplier(scenario);
  const survivalScore = clamp(Math.round(baseScore.survival * multiplier));
  const moralScore = clamp(Math.round(baseScore.moral));
  const outcome = resolveOutcome(survivalScore, moralScore);

  return {
    outcome,
    survivalScore,
    moralScore,
    timeToOutcome: `${randomInt(43, 178)} seconds`,
    jigsawMessage: messageFor(outcome, survivalScore, moralScore)
  };
}
