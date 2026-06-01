import { Router } from "express";
import { getScenarios } from "../controllers/scenarioController";
import { asyncHandler } from "./asyncHandler";

export const scenarioRoutes = Router();

scenarioRoutes.get("/scenarios", asyncHandler(getScenarios));
