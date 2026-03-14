---
name: nextjs-supabase-setup
description: Set up or update the Supabase connection layer in this Next.js App Router project. Use when Codex needs to configure environment variables, create `lib/supabase/client.ts` and `lib/supabase/server.ts`, or add a simple example query that can later support LIMS modules like samples, tests, results, reports, inventory, and the client portal.
---

# nextjs-supabase-setup

## Skill Name

`nextjs-supabase-setup`

## Description

Create the base Supabase connection for a Next.js + TypeScript + Tailwind application.

## When This Skill Should Be Used

Use this skill when:

- Supabase is not connected yet
- browser and server Supabase clients are missing
- environment variables need to be added or fixed
- the founder wants a simple working example of reading data

## Instructions For Codex

1. Check whether the project uses App Router and whether `src/` is used.
2. Create or update `lib/supabase/client.ts` or `src/lib/supabase/client.ts`.
3. Create or update `lib/supabase/server.ts` or `src/lib/supabase/server.ts`.
4. Use only:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Keep the code simple and reusable.
6. Add short comments in plain English so a non-technical founder can understand the purpose.
7. Add one example query that fetches rows from a table such as `samples`.
8. Prefer server-side fetching examples for pages and browser client examples for login or form actions.

## Example Prompts

- `Use $nextjs-supabase-setup to connect Supabase in this Next.js app.`
- `Use $nextjs-supabase-setup to create lib/supabase/client.ts and lib/supabase/server.ts.`
- `Use $nextjs-supabase-setup to add a simple samples query example.`
