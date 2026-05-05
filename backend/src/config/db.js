import mongoose from "mongoose";

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGO_URL is required");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000)
  });
  console.log("MongoDB connected");
}

export function getDbStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  return states[mongoose.connection.readyState] || "unknown";
}
