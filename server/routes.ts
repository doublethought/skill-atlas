import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertManagerSchema, insertDesignerSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/managers", async (req, res) => {
    try {
      const managers = await storage.getManagers();
      res.json(managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
      res.status(500).json({ error: "Failed to fetch managers" });
    }
  });

  app.get("/api/managers/:id", async (req, res) => {
    try {
      const manager = await storage.getManager(req.params.id);
      if (!manager) {
        return res.status(404).json({ error: "Manager not found" });
      }
      res.json(manager);
    } catch (error) {
      console.error("Error fetching manager:", error);
      res.status(500).json({ error: "Failed to fetch manager" });
    }
  });

  app.post("/api/managers", async (req, res) => {
    try {
      const data = insertManagerSchema.parse(req.body);
      const manager = await storage.createManager(data);
      res.status(201).json(manager);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating manager:", error);
      res.status(500).json({ error: "Failed to create manager" });
    }
  });

  app.patch("/api/managers/:id", async (req, res) => {
    try {
      const data = insertManagerSchema.partial().parse(req.body);
      const manager = await storage.updateManager(req.params.id, data);
      if (!manager) {
        return res.status(404).json({ error: "Manager not found" });
      }
      res.json(manager);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating manager:", error);
      res.status(500).json({ error: "Failed to update manager" });
    }
  });

  app.delete("/api/managers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteManager(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Manager not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting manager:", error);
      res.status(500).json({ error: "Failed to delete manager" });
    }
  });

  app.get("/api/managers/:managerId/designers", async (req, res) => {
    try {
      const designers = await storage.getDesignersByManager(req.params.managerId);
      res.json(designers);
    } catch (error) {
      console.error("Error fetching designers:", error);
      res.status(500).json({ error: "Failed to fetch designers" });
    }
  });

  app.get("/api/designers/:id", async (req, res) => {
    try {
      const designer = await storage.getDesigner(req.params.id);
      if (!designer) {
        return res.status(404).json({ error: "Designer not found" });
      }
      res.json(designer);
    } catch (error) {
      console.error("Error fetching designer:", error);
      res.status(500).json({ error: "Failed to fetch designer" });
    }
  });

  app.post("/api/managers/:managerId/designers", async (req, res) => {
    try {
      const data = insertDesignerSchema.parse({
        ...req.body,
        managerId: req.params.managerId,
      });
      const designer = await storage.createDesigner(data);
      res.status(201).json(designer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating designer:", error);
      res.status(500).json({ error: "Failed to create designer" });
    }
  });

  app.patch("/api/designers/:id", async (req, res) => {
    try {
      const data = insertDesignerSchema.partial().parse(req.body);
      const designer = await storage.updateDesigner(req.params.id, data);
      if (!designer) {
        return res.status(404).json({ error: "Designer not found" });
      }
      res.json(designer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating designer:", error);
      res.status(500).json({ error: "Failed to update designer" });
    }
  });

  app.delete("/api/designers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDesigner(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Designer not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting designer:", error);
      res.status(500).json({ error: "Failed to delete designer" });
    }
  });

  return httpServer;
}
