import { Router } from "express";
import { getHistory } from "../controllers/historyController";
import { asyncHandler } from "./asyncHandler";

export const historyRoutes = Router();

historyRoutes.post("/history", asyncHandler(getHistory));
