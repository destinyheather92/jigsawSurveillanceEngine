export type Outcome = "survived" | "died" | "escaped";

export type Scenario = {
  id: string;
  title: string;
  description: string;
  choices: string[];
};

export type DecisionResult = {
  outcome: Outcome;
  survivalScore: number;
  moralScore: number;
  timeToOutcome: string;
  jigsawMessage: string;
};

export type Attempt = {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  choice: string;
  outcome: Outcome;
  survivalScore: number;
  moralScore: number;
  message: string;
  createdAt: string;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchScenarios() {
  return request<{ scenarios: Scenario[] }>("/api/scenarios");
}

export function submitDecision(scenarioId: string, choice: string) {
  return request<DecisionResult>("/api/decide", {
    method: "POST",
    body: JSON.stringify({ scenarioId, choice })
  });
}

export function fetchHistory() {
  return request<{ attempts: Attempt[] }>("/api/history", {
    method: "POST",
    body: JSON.stringify({})
  });
}
