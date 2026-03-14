---
name: form-generator
description: Generate reusable forms with validation for this Next.js LIMS application. Use when Codex needs to create forms with React Hook Form, Tailwind-based UI, loading states, validation errors, and clear submit handling for modules like samples, tests, results, reports, inventory, and client portal workflows.
---

# form-generator

## Skill Name

`form-generator`

## Description

Create reusable data entry forms that are easy for users to understand and easy for the founder to review.

## When This Skill Should Be Used

Use this skill when:

- a page needs a new form
- validation rules must be added
- loading and error states are missing
- one form pattern should be reused in many modules

## Instructions For Codex

1. Use React Hook Form for state and validation handling.
2. Use Tailwind-friendly UI structure that matches the existing app.
3. Include:
   - input validation
   - submit loading state
   - field-level error messages
   - form-level error handling
4. Add short comments in plain English so a non-technical founder can follow the form flow.
5. Make the form reusable with props where reasonable.
6. Keep naming generic so the pattern can later be reused for samples, tests, results, reports, inventory, and client portal forms.

## Example Prompts

- `Use $form-generator to build a sample intake form with validation.`
- `Use $form-generator to create an inventory update form with loading and error states.`
- `Use $form-generator to create a reusable report request form.`
