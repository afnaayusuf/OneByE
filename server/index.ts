import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

const metricsStore: Record<string, number> = {
  volume: 57,
  pressure: 13.4,
  vibration: 72.6,
  battery: 84,
  network: 23,
  gas: 1380,
};

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/metrics", (_req, res) => {
    res.json(metricsStore);
  });

  app.post("/api/metrics", (req, res) => {
    const updates = req.body as Record<string, number>;
    for (const [key, val] of Object.entries(updates)) {
      if (key in metricsStore && typeof val === "number") {
        metricsStore[key] = val;
      }
    }
    res.json(metricsStore);
  });

  app.get("/api/metrics/:id", (req, res) => {
    const id = req.params.id;
    if (id in metricsStore) {
      res.json({ value: metricsStore[id] });
    } else {
      res.status(404).json({ error: "metric not found" });
    }
  });

  return app;
}
