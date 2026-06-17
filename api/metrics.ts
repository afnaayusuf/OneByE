import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);

  if (req.method === "GET") {
    const rows = await sql`SELECT name, value FROM metrics`;
    const result: Record<string, number> = {};
    for (const row of rows) {
      result[row.name] = row.value;
    }
    return res.json(result);
  }

  if (req.method === "POST") {
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
    return res.json(result);
  }

  res.status(405).json({ error: "Method not allowed" });
}
