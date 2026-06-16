import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Metrics endpoints
  app.get("/api/metrics/volume", (_req, res) => {
    res.json({ value: 57 });
  });

  app.get("/api/metrics/pressure", (_req, res) => {
    res.json({ value: 13.4 });
  });

  app.get("/api/metrics/vibration", (_req, res) => {
    res.json({ value: 72.6 });
  });

  app.get("/api/metrics/battery", (_req, res) => {
    res.json({ value: 84 });
  });

  app.get("/api/metrics/network", (_req, res) => {
    res.json({ value: 23 });
  });

  app.get("/api/metrics/gas", (_req, res) => {
    res.json({ value: 1380 });
  });

  return app;
}
