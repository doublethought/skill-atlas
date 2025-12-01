import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const managers = pgTable("managers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  avatarColor: text("avatar_color").notNull().default("amber"),
});

export const insertManagerSchema = createInsertSchema(managers).omit({
  id: true,
});

export type InsertManager = z.infer<typeof insertManagerSchema>;
export type Manager = typeof managers.$inferSelect;

export const levelEnum = z.enum(["P30", "P40", "P50", "P60", "P70"]);
export type Level = z.infer<typeof levelEnum>;

export const archetypeEnum = z.enum(["Craft-y", "Systems-y", "Business-y"]);
export type Archetype = z.infer<typeof archetypeEnum>;

export const designers = pgTable("designers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  managerId: varchar("manager_id").notNull().references(() => managers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  level: text("level").notNull().$type<Level>(),
  maturityInRole: integer("maturity_in_role").notNull(),
  fitForRole: integer("fit_for_role").notNull(),
  archetype: text("archetype").notNull().$type<Archetype>(),
  skills: jsonb("skills").notNull().$type<Record<string, number>>(),
});

export const insertDesignerSchema = createInsertSchema(designers).omit({
  id: true,
}).extend({
  level: levelEnum,
  archetype: archetypeEnum,
  maturityInRole: z.number().min(1).max(5),
  fitForRole: z.number().min(1).max(5),
  skills: z.record(z.string(), z.number().min(1).max(5)),
});

export type InsertDesigner = z.infer<typeof insertDesignerSchema>;
export type Designer = typeof designers.$inferSelect;
