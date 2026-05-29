import { Router } from "express";
import { getHistory } from "../controllers/historyController";

export const historyRoutes = Router();

historyRoutes.post("/history", getHistory);
