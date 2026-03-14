# Sample Review Feature

## What This Feature Means

This feature lets the assigned scientist review a sample and leave feedback that can also be read by the lab manager and client.

In simple words:

- lab manager assigns a scientist to a sample
- scientist opens that sample
- scientist adds a review decision and comment
- client can later read the scientist feedback
- everyone can still see the current sample status separately

## What Was Added

### Database

- a new `sample_reviews` table
- a simple review status:
  - `Reviewed`
  - `Needs Changes`
  - `Approved`

### App behavior

- scientist gets a `Scientist Review` form on assigned sample pages
- lab manager can read the review history
- client can read the review history
- every new review is also visible in sample activity and review sections

## Who Can Do What

### Scientist

- can submit review only for samples assigned to that scientist
- can choose a review status
- can write feedback

### Lab Manager

- can assign the scientist
- can read the scientist reviews
- cannot submit scientist review as scientist

### Client

- can read scientist feedback on their own sample
- can also see the sample&apos;s current status
- cannot edit the review

## Where To Test It

- open `/samples`
- open one sample assigned to a scientist
- scientist signs in and opens that sample
- a `Scientist Review` card should appear

After saving a review:

- `Scientist Feedback` should show the review
- `Tracking Summary` should show the latest review
- client should also see the same review on the sample detail page

## Required Migration

Run:

- `supabase/migrations/202603140007_sample_reviews.sql`

## Quick Test Flow

1. Sign in as `lab_manager`
2. Create or open a sample
3. Assign a scientist to the sample
4. Sign in as that `scientist`
5. Open the sample in `My Samples`
6. Add review status and feedback
7. Sign in as the linked `client`
8. Open the same sample and confirm the review is visible
