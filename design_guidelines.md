# Skill Atlas Design Guidelines

## Design Approach

Skill Atlas is a standalone product dashboard for product design leaders. It should feel focused, polished, and customizable without depending on any company-specific design system.

## Key Principles

- Keep the interface data-dense but approachable.
- Use clear visual grouping for dashboards, forms, and team profiles.
- Make comparison views scannable at a glance.
- Prefer generic product design language over internal competency names.
- Keep the skill model easy for adopters to rename or replace.

## Typography

- Primary: Inter for headings, body text, and UI elements.
- Monospace: IBM Plex Mono for compact data labels and small metrics.
- Avoid oversized type inside dashboard panels.
- Use normal letter spacing.

## Product Design Skill Model

Default competency examples:

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

Default career tiers:

- Associate Designer
- Midweight Designer
- Senior Designer
- Lead Designer
- Staff Designer

Default archetypes:

- Craft
- Systems
- Strategy

## Layout System

- Use a max-width application shell for dashboards.
- Use full-width sections and focused panels rather than nested cards.
- Keep repeated item cards compact with restrained radius.
- Stack complex dashboard sections on mobile.

## Components

### Managers List

- Show a clear product name and short value proposition.
- Use manager cards for managers, teams, or portfolios.
- Empty state should help users create their first manager quickly.

### Dashboard

- Header should show manager name, count of designers, average maturity, and average fit.
- Radar chart compares selected designers across the skill model.
- Role sliders show distribution by 1-5 score and can filter by tier.
- Archetype grid groups designers by Craft, Systems, and Strategy orientation.

### Add Designer Form

- Modal form with profile fields first, then role signals, then skill areas.
- Use tier labels instead of internal level codes.
- Keep all scores on a simple 1-5 scale.
- Include AI-Augmented Design as a first-class skill area.

## Accessibility

- All controls should be keyboard navigable.
- Maintain visible focus states.
- Avoid relying only on color for meaning.
- Keep touch targets usable on mobile.
