import { Router } from "express";
import { decide } from "../controllers/decisionController";
import { asyncHandler } from "./asyncHandler";

export const decisionRoutes = Router();

decisionRoutes.post("/decide", asyncHandler(decide));
