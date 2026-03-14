# Sample Tracking Feature

## What This Feature Means

This feature helps the lab follow one sample from the moment it is received until it is completed or disposed.

A normal user should understand it like this:

- every sample gets a clear sample number
- the lab can store an optional barcode number
- staff can see where the sample is now
- staff can record when the sample moves from one person or place to another
- the system keeps a readable history of important actions
- the lab can record disposal at the end of the lifecycle

## What Was Added

This implementation upgrades the earlier basic sample module into a clearer tracking flow.

### New sample fields

- `accession_number`: the readable sample number shown in the UI
- `barcode_value`: optional barcode number
- `source_label`: where the sample came from
- `priority`: `Routine`, `Urgent`, or `STAT`
- `received_at`: when the lab received the sample
- `current_location`: where the sample is now
- `disposed_at`: when it was disposed
- `disposed_by`: who disposed it
- `disposal_reason`: why it was disposed

### New tracking table

`sample_custody_events`

This stores simple movement history such as:

- sample received
- sample handed to another staff member
- sample moved to a storage location

## What Users Can Do

### Lab Manager

- create a new sample with intake details
- see the generated sample number
- update status
- update location
- assign a scientist
- record a custody handoff
- record a storage movement
- dispose a sample with a reason

### Scientist

- open only samples assigned to that scientist
- see sample number, status, location, activity history, and custody history
- cannot edit

### Client

- open only their own samples
- see tracking details in read-only mode
- cannot edit

## Where It Appears In The App

- `/samples`
  - sample list with sample number, location, priority, status, and received date
- `/samples/create`
  - intake form for lab manager
- `/samples/[id]`
  - detail screen with tracking summary, status update, movement logging, progress, and history

## Current Configuration

This feature currently depends on the existing auth and role setup in the project.

### Role access

- `lab_manager`: full access to the sample tracking feature
- `scientist`: read-only access to assigned samples
- `client`: read-only access to their own samples

### Database migrations needed

Apply these migrations in order:

1. `supabase/migrations/202603140001_create_profiles_rbac.sql`
2. `supabase/migrations/202603140002_create_samples_module.sql`
3. `supabase/migrations/202603140003_fix_profiles_rls_recursion.sql`
4. `supabase/migrations/202603140004_current_profile_role_volatile.sql`
5. `supabase/migrations/202603140005_sample_status_disposed_enum.sql`
6. `supabase/migrations/202603140006_sample_tracking_upgrade.sql`
7. `supabase/migrations/202603140007_sample_reviews.sql`

### Required data

Before testing, make sure you have:

- at least one `lab_manager`
- at least one `scientist`
- at least one `client`

The sample create form uses existing profiles from the `profiles` table.

## Simple Verification Checklist

### 1. Create a sample as Lab Manager

Expected result:

- sample saves successfully
- a new sample number is generated automatically
- sample appears in `/samples`
- first movement entry says the sample was received

### 2. Open the sample detail page

Expected result:

- tracking summary shows sample number, source, priority, barcode, location, and received date
- activity history shows creation actions
- chain of custody section shows the receive entry

### 3. Update status and location

Expected result:

- status badge changes
- new location is saved
- activity history shows what changed

### 4. Log a sample movement

Expected result:

- movement appears in `Chain Of Custody`
- if it is a handoff, the selected staff member is shown
- if location is entered, the sample location updates

### 5. Dispose a sample

Expected result:

- status changes to `Disposed`
- disposal reason is required
- disposed date and disposer are visible on the detail page

## Files Added Or Updated

### Database

- `supabase/migrations/202603140005_sample_status_disposed_enum.sql`
- `supabase/migrations/202603140006_sample_tracking_upgrade.sql`

### API

- `src/app/api/samples/route.ts`
- `src/app/api/samples/[id]/route.ts`
- `src/app/api/samples/[id]/custody/route.ts`
- `src/app/api/samples/[id]/reviews/route.ts`

### UI

- `src/app/samples/page.tsx`
- `src/app/samples/create/page.tsx`
- `src/app/samples/[id]/page.tsx`
- `src/components/samples/sample-create-form.tsx`
- `src/components/samples/sample-status-form.tsx`
- `src/components/samples/sample-custody-form.tsx`
- `src/components/samples/sample-review-form.tsx`
- `src/components/samples/sample-review-status-badge.tsx`
- `src/components/samples/sample-status-badge.tsx`
- `src/components/ui/textarea.tsx`

### Shared logic

- `src/lib/samples.ts`

## What To Test By Role

### Test with `lab_manager`

Use this role to test:

- create sample
- update sample status
- change location
- assign scientist
- log movement
- read scientist review feedback
- dispose sample

### Test with `scientist`

Use this role to test:

- only assigned samples are visible
- tracking summary is readable
- custody and activity history are visible
- add scientist review feedback
- save review status

### Test with `client`

Use this role to test:

- only that client’s own samples are visible
- sample details are readable
- scientist review comments are visible
- no edit actions are available

## Important Note

This is the first strong version of sample tracking.

It does **not** yet include:

- barcode scanning hardware integration
- RFID integration
- freezer/rack/bin structured storage mapping
- disposal approval workflow
- printable barcode labels

Those can be added in the next iteration without changing the overall direction of this feature.
