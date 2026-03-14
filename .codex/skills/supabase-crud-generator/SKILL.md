---
name: supabase-crud-generator
description: Generate reusable CRUD helpers for Supabase tables in this Next.js LIMS application. Use when Codex needs to create shared functions such as `createRecord`, `getRecords`, `getRecordById`, `updateRecord`, and `deleteRecord` for modules like samples, tests, results, reports, inventory, and client portal records.
---

# supabase-crud-generator

## Skill Name

`supabase-crud-generator`

## Description

Create reusable Supabase data access functions so the app can read and write records in a consistent way.

## When This Skill Should Be Used

Use this skill when:

- a new table already exists and needs CRUD helpers
- multiple pages or APIs will reuse the same Supabase queries
- the founder wants simpler code instead of repeated query logic

## Instructions For Codex

1. Create a shared data layer file for the target table or module.
2. Implement these functions:
   - `createRecord`
   - `getRecords`
   - `getRecordById`
   - `updateRecord`
   - `deleteRecord`
3. Use the project Supabase client instead of creating ad hoc connections.
4. Keep the functions generic enough to reuse across LIMS modules.
5. Add simple comments above each function explaining what it does in plain language.
6. Return clear success and error information.
7. Prefer typed inputs and outputs with TypeScript.
8. Keep query logic easy to read for a non-technical founder.

## Example Prompts

- `Use $supabase-crud-generator to create CRUD helpers for the samples table.`
- `Use $supabase-crud-generator to build data access functions for inventory items.`
- `Use $supabase-crud-generator to create reusable CRUD for test results.`
