# Team Skills Mapping Dashboard

## Overview

A data visualization dashboard for mapping and analyzing team designer skills across multiple competency areas. The application allows managers to track designer capabilities, role maturity, and career progression using interactive radar charts, scale sliders, and archetype categorization. Built following the Atlassian Design System principles for data-dense productivity tools.

## Current State (December 2025)

**Status**: Full-stack application with PostgreSQL persistence

**What's Built**:
- Multi-manager navigation system with managers listing page (/) and team dashboards (/managers/:managerId)
- Breadcrumb: "Info Pro Managers / [Manager Name]" with clickable navigation
- Manager listing page with "Add Manager" CTA and manager cards
- Profile header with avatar and manager name in large font
- Single active "Team shape" tab
- Skills radar chart with designer toggles, abbreviated axis labels, smooth animations
- Role maturity slider with fixed tick marks and level filtering
- Role fit slider with level filtering
- Archetypes grid (Craft-y, Systems-y, Business-y)
- Add Designer modal with full form (name, level, archetype, maturity, fit, 10 skill categories)
- Delete designer functionality with confirmation dialog (appears on hover in radar chart sidebar and archetype grid)
- Full CRUD API for managers and designers
- PostgreSQL database persistence via Neon

**Key Features**:
- Managers can be created, viewed, and managed from the listing page
- Each manager has their own team of designers
- Designers can be added, viewed, and deleted from the team dashboard
- All data persisted to PostgreSQL database
- Real-time data fetching with React Query
- Delete confirmation dialogs for safety

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter library for lightweight client-side routing.
- `/` - Managers listing page
- `/managers/:managerId` - Team dashboard for specific manager

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

**Key Components**:
- ManagersPage: Manager listing with add manager modal
- Dashboard: Team skills dashboard with radar chart, sliders, archetypes
- SkillsRadarChart: Interactive radar chart with designer toggles and delete functionality
- ScaleSlider: Role maturity and fit visualizations with level filtering
- ArchetypeGrid: Designer grouping by archetype with delete functionality
- AddDesignerModal: Comprehensive form for adding designers

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Structure**: RESTful API with routes registered under `/api` prefix.

**API Endpoints**:
- `GET /api/managers` - List all managers
- `GET /api/managers/:id` - Get single manager
- `POST /api/managers` - Create manager
- `PATCH /api/managers/:id` - Update manager
- `DELETE /api/managers/:id` - Delete manager
- `GET /api/managers/:managerId/designers` - List designers for a manager
- `GET /api/designers/:id` - Get single designer
- `POST /api/managers/:managerId/designers` - Create designer
- `PATCH /api/designers/:id` - Update designer
- `DELETE /api/designers/:id` - Delete designer

**Development Mode**: 
- Vite dev server middleware integrated into Express
- Hot module replacement (HMR) enabled via WebSocket
- Runtime error overlay for development
- Request logging middleware with duration tracking

**Storage Layer**: DatabaseStorage class implementing IStorage interface with Drizzle ORM.

### Data Storage Solutions

**Database**: PostgreSQL via Neon serverless driver (neon-http for HTTP connections).

**ORM**: Drizzle ORM with schema definition in `shared/schema.ts`.

**Schema Management**: Drizzle Kit for schema push (`npm run db:push`).

**Data Model**:
- Manager: id (UUID), name, avatarColor
- Designer: id (UUID), managerId (FK), name, level (P30-P70), maturityInRole (1-5), fitForRole (1-5), archetype (Craft-y/Systems-y/Business-y), skills (JSONB)
- User: id (UUID), username, password (unused, for future auth)

### Authentication and Authorization

**Current State**: No authentication implemented. Application is open without login requirements.

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
- @neondatabase/serverless for PostgreSQL connectivity (using neon-http driver)
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
