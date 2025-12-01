# Team Skills Mapping Dashboard

## Overview

A data visualization dashboard for mapping and analyzing team designer skills across multiple competency areas. The application allows managers to track designer capabilities, role maturity, and career progression using interactive radar charts, scale sliders, and archetype categorization. Built following the Atlassian Design System principles for data-dense productivity tools.

## Current State (December 2025)

**Status**: Working prototype with mock data

**What's Built**:
- Atlassian-style layout matching their product UI patterns
- Breadcrumb navigation (Positions / Charlie Atlas / ... / Vincent Feeney)
- Profile header with avatar and "Vincent Feeney" name
- Tab navigation: Summary, Details, Direct reports (6), Sub-positions (6), Team shape (active)
- Skills radar chart with designer toggles, abbreviated axis labels, smooth animations
- Role maturity slider with fixed tick marks and level filtering
- Role fit slider with level filtering
- Archetypes grid (Craft-y, Systems-y, Business-y)
- Add Designer modal with full form
- 7 mock designers with full skill data

**What's Using Mock Data** (marked with //todo comments):
- Designer data in Dashboard.tsx (INITIAL_DESIGNERS array)
- All state is in-memory, not persisted

**Next Steps to Consider**:
- Connect to database for data persistence
- Implement backend API endpoints
- Add edit/delete designer functionality

**Planned Feature: Multi-Manager Navigation**:
- "Info Pro Managers" breadcrumb links to a managers listing page
- Managers listing page shows all managers with "Add Manager" CTA
- Clicking a manager navigates to their team view (the current Team shape dashboard)
- Each manager has their own set of designers
- Data model needs: Manager entity with relationship to Designers

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter library for lightweight client-side routing. Single-page application with `/` as the main dashboard route.

**State Management**: 
- React hooks for local component state
- TanStack Query (React Query) for server state management and data fetching
- Form state managed via React Hook Form with Zod validation

**UI Component Library**: 
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component system (New York style variant)
- Custom components built on top of Radix primitives
- Tailwind CSS for styling with custom design tokens

**Design System**: Atlassian Design System aesthetic with:
- Atlassian Sans font family for UI elements
- Atlassian Mono for data labels and metrics
- Neutral base color scheme with blue primary accent
- Custom spacing scale using Tailwind units (2, 4, 6, 8, 12, 16)
- Elevation system using rgba-based shadows

**Key Features**:
- Skills radar chart visualization using Recharts library
- Designer archetype categorization (Craft-y, Systems-y, Business-y)
- Role maturity and fit-for-role scale sliders with level filtering
- Interactive designer avatars with tooltips
- Modal-based designer addition workflow

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Build Process**: 
- esbuild for server-side bundling with selective dependency bundling
- Vite for client-side building
- Custom build script that bundles allowlisted dependencies to reduce cold start times

**API Structure**: RESTful API with routes registered under `/api` prefix. Currently implements storage interface pattern but routes are not yet implemented.

**Development Mode**: 
- Vite dev server middleware integrated into Express
- Hot module replacement (HMR) enabled via WebSocket
- Runtime error overlay for development
- Request logging middleware with duration tracking

**Storage Layer**: Abstract storage interface (`IStorage`) with in-memory implementation (`MemStorage`). Designed to be swapped with database persistence layer.

### Data Storage Solutions

**Database**: PostgreSQL via Neon serverless driver configured but not yet implemented.

**ORM**: Drizzle ORM with schema definition in `shared/schema.ts`. Currently defines basic user table structure.

**Schema Management**: Drizzle Kit for migrations stored in `/migrations` directory.

**Current State**: Application uses in-memory storage (`MemStorage`) with mock designer data. Database integration is configured but not connected to the UI.

**Data Model** (based on TypeScript interfaces):
- Designer: id, name, level (P30-P70), maturityInRole (1-5), fitForRole (1-5), archetype, skills (key-value pairs)
- User: id, username, password (basic auth structure defined but unused)

### Authentication and Authorization

**Current State**: Basic user schema defined with username/password fields, but no authentication is implemented. Application is currently open without login requirements.

**Prepared Infrastructure**: 
- User table schema with unique username constraint
- Password field (would require hashing implementation)
- Insert user validation schema using Zod

### External Dependencies

**UI Component Libraries**:
- @radix-ui/* (18 different primitive component packages)
- recharts for data visualization
- react-hook-form with @hookform/resolvers for form handling
- cmdk for command palette pattern
- embla-carousel-react for carousels
- vaul for drawers

**Data & Validation**:
- zod for runtime type validation
- drizzle-zod for schema-to-zod conversion
- date-fns for date manipulation

**Database & Session**:
- @neondatabase/serverless for PostgreSQL connectivity
- drizzle-orm for database operations
- connect-pg-simple for PostgreSQL session storage (configured but unused)

**Build & Development Tools**:
- vite with @vitejs/plugin-react
- esbuild for server bundling
- tsx for TypeScript execution
- tailwindcss with autoprefixer for styling
- @replit plugins for development environment integration

**Fonts**: Atlassian Sans and Atlassian Mono loaded from Atlassian CDN via font-face declarations.

**Design Tokens**: Custom CSS variables for colors, spacing, shadows, and typography defined in root stylesheet.