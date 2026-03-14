---
name: dashboard-widget-builder
description: Generate reusable dashboard widgets for this Next.js LIMS application using Tailwind CSS. Use when Codex needs to create modular dashboard UI pieces such as `StatCard`, `DataTable`, `ChartCard`, and `AlertCard` for operational screens covering samples, tests, results, reports, inventory, or client portal activity.
---

# dashboard-widget-builder

## Skill Name

`dashboard-widget-builder`

## Description

Build reusable dashboard widgets that fit a clean LIMS interface and can be reused across multiple modules.

## When This Skill Should Be Used

Use this skill when:

- a dashboard page needs reusable visual components
- the founder wants a clean Tailwind-based admin interface
- metrics, alerts, or tabular lab data need to be shown consistently

## Instructions For Codex

1. Build reusable components with clear props.
2. Support these components when requested:
   - `StatCard`
   - `DataTable`
   - `ChartCard`
   - `AlertCard`
3. Use Tailwind CSS and keep the markup clean.
4. Add simple comments explaining the purpose of non-obvious UI sections.
5. Make the components responsive for desktop and mobile.
6. Keep the components generic so they can later show samples, tests, results, inventory, and client portal metrics.
7. Prefer composition over hardcoding module-specific labels.
8. Reuse the approved visual direction below for future screens so the product keeps one clear identity.
9. Treat this theme as locked unless the user explicitly asks to redesign it.
10. Before building a new screen, check the live theme source files listed below and follow them closely.

## Locked Theme Direction

- Use a clean science palette:
  - deep marine for key surfaces and headers
  - soft teal or mint for highlights
  - very light laboratory-style backgrounds
  - simple rounded cards with clear spacing
- Keep the interface calm, readable, and founder-friendly.
- Avoid neon, purple-heavy, or gaming-style themes.
- Prefer a modern lab look over a generic SaaS look.
- Keep contrast high and labels easy for non-technical users to scan.

## Live Theme Source Files

Future dashboard and app screens should follow these files first:

- `src/app/globals.css`
- `src/components/app-logo.tsx`
- `src/components/app-sidebar.tsx`
- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`

These files define the current approved theme, palette, spacing, and brand direction.

## Locked Theme Rules

- Keep the current marine + teal + mint palette family.
- Keep bright, laboratory-style backgrounds instead of dark full-screen layouts.
- Keep cards soft, rounded, and easy to scan.
- Keep icons science or lab related when possible.
- Keep language simple and founder-friendly.
- Do not switch to another aesthetic direction unless the user explicitly requests it.

## Pinterest References

Use these as the approved inspiration references for future dashboard screens:

- https://www.pinterest.com/pin/1121537113453028503/ - LabX: UI/UX & Web Design for Laboratory Dashboard
- https://www.pinterest.com/pin/439945457346020393/ - Medical Dashboard UI
- https://www.pinterest.com/pin/51158145755730024/ - Medical Dashboard
- https://ph.pinterest.com/pin/clinical-dashboard--460985711861682463/ - Clinical dashboard
- https://www.pinterest.com/pin/user-interface-design--576320083569555364/ - Fractal Science Dashboard

## Example Prompts

- `Use $dashboard-widget-builder to create StatCard and AlertCard for the dashboard.`
- `Use $dashboard-widget-builder to build a reusable DataTable for sample records.`
- `Use $dashboard-widget-builder to create a ChartCard for turnaround time trends.`
- `Use $dashboard-widget-builder and keep the locked science theme from the current app.`
