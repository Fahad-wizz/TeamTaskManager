import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });
dotenv.config({ path: resolve(__dirname, "../../.env") });

const port = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

const app = createApp();

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Team Task Manager API running on port ${port}`);
});

connectDb().catch((error) => {
  console.error(`MongoDB connection failed: ${error.message}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
