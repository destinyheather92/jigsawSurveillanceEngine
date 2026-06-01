import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { decisionRoutes } from "./routes/decisionRoutes";
import { historyRoutes } from "./routes/historyRoutes";
import { scenarioRoutes } from "./routes/scenarioRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

const allowedOrigins = [
  "https://jigsaw-surveillance-engine-client.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.options("*", cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "online", database: "linked" });
});

app.use("/api", scenarioRoutes);
app.use("/api", decisionRoutes);
app.use("/api", historyRoutes);

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

const serverRoot = path.basename(__dirname) === "dist" ? path.resolve(__dirname, "..") : __dirname;
const clientDistPath = path.resolve(serverRoot, "../client/dist");
app.use(express.static(clientDistPath));

app.get("*", (_request, response) => {
  response.sendFile(path.join(clientDistPath, "index.html"), (error) => {
    if (error) {
      response.status(404).json({ error: "Client build not found" });
    }
  });
});

app.listen(port, () => {
  console.log(`JIGSAW surveillance API listening on http://127.0.0.1:${port}`);
});
