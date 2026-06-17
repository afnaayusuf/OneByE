import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const defaults = [
  { name: "volume", value: 57 },
  { name: "pressure", value: 13.4 },
  { name: "vibration", value: 72.6 },
  { name: "battery", value: 84 },
  { name: "network", value: 23 },
  { name: "gas", value: 1380 },
];

for (const m of defaults) {
  await sql`INSERT INTO metrics (name, value) VALUES (${m.name}, ${m.value}) ON CONFLICT (name) DO NOTHING`;
}

console.log("Seeded metrics table");
