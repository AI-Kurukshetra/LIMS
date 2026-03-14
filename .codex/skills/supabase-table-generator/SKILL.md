---
name: supabase-table-generator
description: Generate Supabase SQL migration files for PostgreSQL tables in this LIMS project. Use when Codex needs to create new tables for modules such as samples, tests, results, reports, inventory, or client portal data, including UUID primary keys, created_at and updated_at timestamps, indexes, foreign keys, and business constraints.
---

# supabase-table-generator

## Skill Name

`supabase-table-generator`

## Description

Generate migration-safe SQL for Supabase tables using consistent LIMS-friendly patterns.

## When This Skill Should Be Used

Use this skill when:

- a new database table is needed
- a founder wants a clean SQL migration for Supabase
- a module needs foreign keys to another table
- indexes or constraints need to be added in a reusable way

## Instructions For Codex

1. Create SQL that is compatible with Supabase PostgreSQL migrations.
2. Every table must include:
   - `id uuid primary key default gen_random_uuid()`
   - `created_at timestamptz not null default timezone('utc'::text, now())`
   - `updated_at timestamptz not null default timezone('utc'::text, now())`
3. Add `create extension if not exists pgcrypto;` if UUID generation needs it.
4. Add foreign keys with clear constraint names.
5. Add indexes for parent IDs, lookup fields, and unique business columns when useful.
6. Add `check` or `unique` constraints when the business rules require them.
7. Write simple comments in the SQL so a non-technical founder can follow what each section does.
8. Output the result in a format suitable for `supabase/migrations/<timestamp>_<name>.sql`.

## Example Prompts

- `Use $supabase-table-generator to create a samples table migration.`
- `Use $supabase-table-generator to create a tests table linked to samples.`
- `Use $supabase-table-generator to create an inventory table with indexes and constraints.`
