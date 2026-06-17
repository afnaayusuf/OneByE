import { pgTable, serial, text, timestamp, doublePrecision } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  value: doublePrecision("value").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
