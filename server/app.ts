import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { decisionRoutes } from "./routes/decisionRoutes";
import { historyRoutes } from "./routes/historyRoutes";
import { scenarioRoutes } from "./routes/scenarioRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "online", database: "linked" });
});

app.use("/api", scenarioRoutes);
app.use("/api", decisionRoutes);
app.use("/api", historyRoutes);

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
