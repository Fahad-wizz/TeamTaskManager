import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": process.env.VITE_API_PROXY || "http://localhost:5000",
      "/projects": process.env.VITE_API_PROXY || "http://localhost:5000",
      "/tasks": process.env.VITE_API_PROXY || "http://localhost:5000",
      "/dashboard": process.env.VITE_API_PROXY || "http://localhost:5000",
      "/users": process.env.VITE_API_PROXY || "http://localhost:5000"
    }
  }
});
