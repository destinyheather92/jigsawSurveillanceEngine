import { Router } from "express";
import { decide } from "../controllers/decisionController";

export const decisionRoutes = Router();

decisionRoutes.post("/decide", decide);
