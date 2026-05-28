import { 
  type User, type InsertUser,
  type Manager, type InsertManager,
  type Designer, type InsertDesigner,
  users, managers, designers
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { demoDesigners, demoManager } from "@shared/demoData";

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
  private get database() {
    if (!db) {
      throw new Error("DATABASE_URL is not set");
    }

    return db;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.database.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.database.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.database.insert(users).values(insertUser).returning();
    return user;
  }

  async getManagers(): Promise<Manager[]> {
    return this.database.select().from(managers);
  }

  async getManager(id: string): Promise<Manager | undefined> {
    const [manager] = await this.database.select().from(managers).where(eq(managers.id, id));
    return manager;
  }

  async createManager(manager: InsertManager): Promise<Manager> {
    const [created] = await this.database.insert(managers).values(manager).returning();
    return created;
  }

  async updateManager(id: string, manager: Partial<InsertManager>): Promise<Manager | undefined> {
    const [updated] = await this.database.update(managers).set(manager).where(eq(managers.id, id)).returning();
    return updated;
  }

  async deleteManager(id: string): Promise<boolean> {
    const result = await this.database.delete(managers).where(eq(managers.id, id)).returning();
    return result.length > 0;
  }

  async getDesignersByManager(managerId: string): Promise<Designer[]> {
    return this.database.select().from(designers).where(eq(designers.managerId, managerId));
  }

  async getDesigner(id: string): Promise<Designer | undefined> {
    const [designer] = await this.database.select().from(designers).where(eq(designers.id, id));
    return designer;
  }

  async createDesigner(designer: InsertDesigner): Promise<Designer> {
    const [created] = await this.database.insert(designers).values(designer).returning();
    return created;
  }

  async updateDesigner(id: string, designer: Partial<InsertDesigner>): Promise<Designer | undefined> {
    const [updated] = await this.database.update(designers).set(designer).where(eq(designers.id, id)).returning();
    return updated;
  }

  async deleteDesigner(id: string): Promise<boolean> {
    const result = await this.database.delete(designers).where(eq(designers.id, id)).returning();
    return result.length > 0;
  }
}

export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private managers = new Map<string, Manager>();
  private designers = new Map<string, Designer>();

  constructor() {
    this.managers.set(demoManager.id, demoManager);
    for (const designer of demoDesigners) {
      this.designers.set(designer.id, designer);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const created = { ...user, id: crypto.randomUUID() };
    this.users.set(created.id, created);
    return created;
  }

  async getManagers(): Promise<Manager[]> {
    return Array.from(this.managers.values());
  }

  async getManager(id: string): Promise<Manager | undefined> {
    return this.managers.get(id);
  }

  async createManager(manager: InsertManager): Promise<Manager> {
    const created = {
      id: crypto.randomUUID(),
      avatarColor: manager.avatarColor ?? "avatar:aurora",
      name: manager.name,
    };
    this.managers.set(created.id, created);
    return created;
  }

  async updateManager(id: string, manager: Partial<InsertManager>): Promise<Manager | undefined> {
    const current = this.managers.get(id);
    if (!current) {
      return undefined;
    }

    const updated = { ...current, ...manager };
    this.managers.set(id, updated);
    return updated;
  }

  async deleteManager(id: string): Promise<boolean> {
    const deleted = this.managers.delete(id);
    for (const designer of Array.from(this.designers.values())) {
      if (designer.managerId === id) {
        this.designers.delete(designer.id);
      }
    }
    return deleted;
  }

  async getDesignersByManager(managerId: string): Promise<Designer[]> {
    return Array.from(this.designers.values()).filter((designer) => designer.managerId === managerId);
  }

  async getDesigner(id: string): Promise<Designer | undefined> {
    return this.designers.get(id);
  }

  async createDesigner(designer: InsertDesigner): Promise<Designer> {
    const created = { ...designer, id: crypto.randomUUID() };
    this.designers.set(created.id, created);
    return created;
  }

  async updateDesigner(id: string, designer: Partial<InsertDesigner>): Promise<Designer | undefined> {
    const current = this.designers.get(id);
    if (!current) {
      return undefined;
    }

    const updated = { ...current, ...designer };
    this.designers.set(id, updated);
    return updated;
  }

  async deleteDesigner(id: string): Promise<boolean> {
    return this.designers.delete(id);
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemoryStorage();
