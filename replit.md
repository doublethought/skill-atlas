# Skill Atlas

## Overview

A full-stack dashboard for mapping product designer skills across generic, public-friendly competency areas. The app helps teams compare product design craft, design systems strength, AI-augmented workflow capability, role maturity, role fit, and leadership signals.

## Current State

**Status**: Full-stack application with optional PostgreSQL persistence and local in-memory fallback.

**What's Built**:

- Managers listing page at `/`
- Team dashboard at `/managers/:managerId`
- Manager creation and deletion
- Designer creation and deletion
- Skills radar chart with designer toggles
- Role maturity slider with tier filtering
- Role fit slider with tier filtering
- Archetype grid for Craft, Systems, and Strategy
- Add Designer modal with generic product design competencies
- REST API for managers and designers
- PostgreSQL persistence via Drizzle when `DATABASE_URL` is set
- In-memory storage fallback for local exploration

## Default Skill Model

Career tiers:

- Associate Designer
- Midweight Designer
- Senior Designer
- Lead Designer
- Staff Designer

Competencies:

- Product Thinking
- Visual & UI Craft
- UX & Interaction Design
- Design Systems
- Storytelling & Influence
- Data-Informed Decisions
- Research & Discovery
- Prototyping & Experimentation
- AI-Augmented Design
- Leadership & Collaboration

Archetypes:

- Craft
- Systems
- Strategy

## System Architecture

### Frontend

- React 18 with TypeScript
- Vite development and build tooling
- Wouter routing
- TanStack Query for server state
- React Hook Form and Zod for forms
- shadcn/ui and Radix UI primitives
- Tailwind CSS theme tokens
- Recharts for data visualization

### Backend

- Express.js with TypeScript
- REST API under `/api`
- Drizzle ORM schema in `shared/schema.ts`
- PostgreSQL support through the Neon serverless driver
- In-memory storage when no database URL is configured

### API Endpoints

- `GET /api/managers`
- `GET /api/managers/:id`
- `POST /api/managers`
- `PATCH /api/managers/:id`
- `DELETE /api/managers/:id`
- `GET /api/managers/:managerId/designers`
- `GET /api/designers/:id`
- `POST /api/managers/:managerId/designers`
- `PATCH /api/designers/:id`
- `DELETE /api/designers/:id`

## Customization Notes

- Skill categories are currently defined in `client/src/pages/Dashboard.tsx` and `client/src/components/AddDesignerModal.tsx`.
- Tier and archetype enums are defined in `shared/schema.ts`.
- Theme tokens and visual styling live in `client/src/index.css`.
- Storage behavior is in `server/storage.ts`.
