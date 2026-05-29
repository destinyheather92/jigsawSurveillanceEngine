import type { Request, Response } from "express";
import { prisma } from "../db/client";

export async function getScenarios(_request: Request, response: Response) {
  const scenarios = await prisma.scenario.findMany({
    orderBy: {
      title: "asc"
    }
  });

  response.json({
    scenarios: scenarios.map((scenario) => ({
      ...scenario,
      choices: JSON.parse(scenario.choices) as string[]
    }))
  });
}
