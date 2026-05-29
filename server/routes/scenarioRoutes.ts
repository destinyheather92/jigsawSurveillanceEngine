import { Router } from "express";
import { getScenarios } from "../controllers/scenarioController";

export const scenarioRoutes = Router();

scenarioRoutes.get("/scenarios", getScenarios);
