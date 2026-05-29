import type { Request, Response } from "express";
import { prisma } from "../db/client";

export async function getHistory(_request: Request, response: Response) {
  const [attempts, scenarios] = await Promise.all([
    prisma.attempt.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    }),
    prisma.scenario.findMany()
  ]);

  const scenarioTitles = new Map(scenarios.map((scenario) => [scenario.id, scenario.title]));

  response.json({
    attempts: attempts.map((attempt) => ({
      ...attempt,
      scenarioTitle: scenarioTitles.get(attempt.scenarioId) ?? "UNKNOWN ROOM"
    }))
  });
}
