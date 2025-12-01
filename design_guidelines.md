# Team Skills Mapping Dashboard - Design Guidelines

## Design Approach
**System:** Atlassian Design System - This is a data-dense productivity tool requiring consistent, functional UI patterns that match Atlassian's ecosystem.

**Key Principles:**
- Information hierarchy through structure, not decoration
- Efficient data visualization with interactive controls
- Scannable layouts for quick insight gathering
- Clear visual grouping of related elements

## Typography

**Font Families:**
- Primary: Atlassian Sans (headings, body text, UI elements)
- Monospace: Atlassian Mono (data labels, metrics, level indicators)

**Hierarchy:**
- Page Title: 24px, semibold
- Section Headers: 18px, semibold
- Card/Component Titles: 14px, semibold
- Body Text: 14px, regular
- Labels/Metadata: 12px, regular
- Data Points: 12px, Atlassian Mono

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section spacing: gap-6, gap-8
- Container margins: m-4, m-6
- Element spacing: space-y-4, space-y-6

**Grid Structure:**
- Max container width: max-w-7xl
- Dashboard sections stack vertically with consistent 8-unit gaps
- Form layouts use 2-column grid on desktop (grid-cols-2), single column on mobile

## Component Library

### Navigation & Header
- Top navigation bar with application title and "Add Designer" primary action button
- Breadcrumb trail showing current view context
- Filter controls positioned consistently below section headers

### Radar Chart Dashboard
- Large centered chart area (minimum 600px height on desktop)
- Legend positioned to the right of chart showing designer names with toggle checkboxes
- Each designer represented by distinct line pattern in chart
- Grid lines and axis labels using Atlassian Mono at 11px

### Add Designer Form
- Modal overlay (600px wide) with clear header "Add Designer"
- Form sections: Personal Info, Skill Categories, Role Assessment, Archetype
- Input fields stacked with 4-unit vertical spacing
- Dropdown selectors for Level and Archetype
- Number inputs (1-5 scale) with increment/decrement controls
- Primary "Add Designer" and secondary "Cancel" buttons at bottom

### Slider Visualizations (Maturity & Fit)
- Full-width container with scale markers 1-5 evenly distributed
- Horizontal line with tick marks at each scale point
- Avatar circles (40px diameter) positioned along scale based on score
- Initials displayed in avatar using Atlassian Mono, 14px
- Tooltip on hover showing: Full Name, Level (in Atlassian Mono)
- Filter dropdown above slider (right-aligned)

### Archetype Breakdown
- 3-column grid layout (grid-cols-3 on desktop, grid-cols-1 on mobile)
- Each archetype section has header with count badge
- Designer cards within each column: avatar (48px), name, level
- Cards have subtle border with 4-unit padding

### Interactive Elements
- Checkboxes for radar chart toggles (standard Atlassian checkbox pattern)
- Dropdown filters with search capability for level filtering
- Avatar components with hover states revealing tooltips
- Form inputs with clear focus states and validation feedback

### Data Visualization Standards
- Radar chart: 5-8 axes for skill categories, circular grid with 5 levels
- Scale visualizations: Clear numeric markers, consistent spacing
- All charts use consistent axis labeling and grid patterns
- Interactive elements have clear affordances (cursor changes, hover states)

## Functional Layout Details

**Dashboard View Structure:**
1. Header section with title and primary action (h-16)
2. Radar chart section (min-h-[600px]) with legend sidebar
3. Maturity slider section (h-32 for slider area plus labels)
4. Fit slider section (h-32 for slider area plus labels)
5. Archetype breakdown grid (auto height based on content)

**Form Modal:**
- Fixed width (600px), centered overlay
- Scrollable content area if needed
- Sticky footer with action buttons
- Input groups with labels above fields
- Helper text in 12px below complex inputs

## Accessibility
- All interactive elements keyboard navigable
- ARIA labels on chart data points
- Color-independent data visualization (use patterns/shapes in addition to visual encoding)
- Focus indicators on all controls
- Minimum touch target 44px for mobile interactions

## Responsive Behavior
- Desktop (lg): Multi-column layouts, side-by-side chart legends
- Tablet (md): 2-column where appropriate, stacked chart sections
- Mobile: Single column, vertically stacked all elements, chart scales to container width