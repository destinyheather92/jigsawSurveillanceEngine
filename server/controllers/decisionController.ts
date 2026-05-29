import type { Request, Response } from "express";
import { prisma } from "../db/client";
//Prisma is an ORM (Object Relational Mapper) Prisma lets you talk to your database using JavaScript/TypeScript instead of writing raw SQL.
import { evaluateDecision } from "../services/jigsawEngine";
// thisis an express api controller for the jigsaw game its job is to recieve a players decision, validate it, look up the scenario in the db, score the decison using the jigsaw engine, save the attempt to the db and return the result to the client
type DecideBody = {
  scenarioId?: string;
  choice?: string;
};

export async function decide(request: Request<unknown, unknown, DecideBody>, response: Response) {
  const { scenarioId, choice } = request.body;

  if (!scenarioId || !choice) {
    return response.status(400).json({ error: "scenarioId and choice are required" });
  }

  const scenario = await prisma.scenario.findUnique({
    where: {
      id: scenarioId
    }
  });

  if (!scenario) {
    return response.status(404).json({ error: "Scenario not found" });
  }

  const choices = JSON.parse(scenario.choices) as string[];

  if (!choices.includes(choice)) {
    return response.status(400).json({ error: "Choice does not belong to this scenario" });
  }

  const result = evaluateDecision(scenario, choice);

  await prisma.attempt.create({
    data: {
      scenarioId,
      choice,
      outcome: result.outcome,
      survivalScore: result.survivalScore,
      moralScore: result.moralScore,
      message: result.jigsawMessage
    }
  });

  response.json(result);
}
