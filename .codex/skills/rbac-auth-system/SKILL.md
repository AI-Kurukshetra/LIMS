---
name: rbac-auth-system
description: Implement role-based access control for this Next.js and Supabase LIMS application. Use when Codex needs to create a `profiles` table linked to Supabase auth users, assign roles such as admin, lab_manager, scientist, technician, and client, and protect pages or routes with middleware based on role access.
---

# rbac-auth-system

## Skill Name

`rbac-auth-system`

## Description

Create a basic role-based access control system so each type of user only sees the pages and actions they are allowed to use.

## When This Skill Should Be Used

Use this skill when:

- the app needs role-based access
- pages should be protected by user type
- Supabase auth users need linked profile records
- the founder wants a simple permissions model for future modules

## Instructions For Codex

1. Create a `profiles` table linked to `auth.users`.
2. Support these roles:
   - `admin`
   - `lab_manager`
   - `scientist`
   - `technician`
   - `client`
3. Add middleware or server checks to protect pages based on roles.
4. Keep permission checks easy to read and easy to extend.
5. Add plain-English comments explaining why each protection rule exists.
6. Structure the code so future modules like samples, tests, results, reports, inventory, and the client portal can each define role rules without rewriting the whole auth layer.
7. Prefer reusable helper functions for checking access.

## Example Prompts

- `Use $rbac-auth-system to create a profiles table linked to auth.users.`
- `Use $rbac-auth-system to protect inventory pages so only admin and lab_manager can edit them.`
- `Use $rbac-auth-system to add middleware for scientist and technician dashboard access.`
