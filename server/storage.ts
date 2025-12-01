import { 
  type User, type InsertUser,
  type Manager, type InsertManager,
  type Designer, type InsertDesigner,
  users, managers, designers
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getManagers(): Promise<Manager[]>;
  getManager(id: string): Promise<Manager | undefined>;
  createManager(manager: InsertManager): Promise<Manager>;
  updateManager(id: string, manager: Partial<InsertManager>): Promise<Manager | undefined>;
  deleteManager(id: string): Promise<boolean>;
  
  getDesignersByManager(managerId: string): Promise<Designer[]>;
  getDesigner(id: string): Promise<Designer | undefined>;
  createDesigner(designer: InsertDesigner): Promise<Designer>;
  updateDesigner(id: string, designer: Partial<InsertDesigner>): Promise<Designer | undefined>;
  deleteDesigner(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getManagers(): Promise<Manager[]> {
    return db.select().from(managers);
  }

  async getManager(id: string): Promise<Manager | undefined> {
    const [manager] = await db.select().from(managers).where(eq(managers.id, id));
    return manager;
  }

  async createManager(manager: InsertManager): Promise<Manager> {
    const [created] = await db.insert(managers).values(manager).returning();
    return created;
  }

  async updateManager(id: string, manager: Partial<InsertManager>): Promise<Manager | undefined> {
    const [updated] = await db.update(managers).set(manager).where(eq(managers.id, id)).returning();
    return updated;
  }

  async deleteManager(id: string): Promise<boolean> {
    const result = await db.delete(managers).where(eq(managers.id, id)).returning();
    return result.length > 0;
  }

  async getDesignersByManager(managerId: string): Promise<Designer[]> {
    return db.select().from(designers).where(eq(designers.managerId, managerId));
  }

  async getDesigner(id: string): Promise<Designer | undefined> {
    const [designer] = await db.select().from(designers).where(eq(designers.id, id));
    return designer;
  }

  async createDesigner(designer: InsertDesigner): Promise<Designer> {
    const [created] = await db.insert(designers).values(designer).returning();
    return created;
  }

  async updateDesigner(id: string, designer: Partial<InsertDesigner>): Promise<Designer | undefined> {
    const [updated] = await db.update(designers).set(designer).where(eq(designers.id, id)).returning();
    return updated;
  }

  async deleteDesigner(id: string): Promise<boolean> {
    const result = await db.delete(designers).where(eq(designers.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
