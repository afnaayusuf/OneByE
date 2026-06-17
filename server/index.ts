import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { neon } from "@neondatabase/serverless";

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

  app.get("/api/metrics", async (_req, res) => {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const rows = await sql`SELECT name, value FROM metrics`;
      const result: Record<string, number> = {};
      for (const row of rows) {
        result[row.name] = row.value;
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "db error" });
    }
  });

  app.post("/api/metrics", async (req, res) => {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const updates = req.body as Record<string, number>;
      for (const [name, value] of Object.entries(updates)) {
        if (typeof value === "number") {
          await sql`UPDATE metrics SET value = ${value}, updated_at = now() WHERE name = ${name}`;
        }
      }
      const rows = await sql`SELECT name, value FROM metrics`;
      const result: Record<string, number> = {};
      for (const row of rows) {
        result[row.name] = row.value;
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "db error" });
    }
  });

  app.get("/api/metrics/:id", async (req, res) => {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const rows = await sql`SELECT value FROM metrics WHERE name = ${req.params.id}`;
      if (rows.length > 0) {
        res.json({ value: rows[0].value });
      } else {
        res.status(404).json({ error: "metric not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "db error" });
    }
  });

  return app;
}
