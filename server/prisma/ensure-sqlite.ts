import "dotenv/config";
import fs from "fs";
import path from "path";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

if (!databaseUrl.startsWith("file:")) {
  throw new Error("Only file-based SQLite DATABASE_URL values are supported locally.");
}

const rawFilePath = databaseUrl.replace(/^file:/, "");
const schemaDir = path.resolve(process.cwd(), "prisma");
const databasePath = path.isAbsolute(rawFilePath)
  ? rawFilePath
  : path.resolve(schemaDir, rawFilePath);

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

if (!fs.existsSync(databasePath)) {
  fs.closeSync(fs.openSync(databasePath, "a"));
  console.log(`Created SQLite database file at ${databasePath}`);
} else {
  console.log(`SQLite database file found at ${databasePath}`);
}
