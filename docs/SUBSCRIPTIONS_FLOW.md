# EIPs Insight Subscription Flow

This document explains how subscriptions work in this repo end to end:

- where users subscribe,
- which APIs are called,
- what gets stored in MongoDB,
- how update emails are generated,
- how unsubscribe works,
- and what the current design intentionally does not support.

## Purpose

The subscription system lets a signed-in user follow a specific:

- `EIP`
- `ERC`
- `RIP`

and receive email notifications when the tracked proposal file changes.

The system is proposal-specific. It is not a global "subscribe to all EIPs" system.

## High-Level Flow

1. A user opens an individual proposal page such as `/eips/[eip-number]`.
2. The page shows a subscription button.
3. The button checks whether the current signed-in user is already subscribed.
4. If the user subscribes, the frontend calls `POST /api/subscribe`.
5. The API stores a row in MongoDB `subscriptions`.
6. A confirmation email is sent immediately.
7. Later, the sync job scans tracked proposal files for new commits.
8. If matching changes are found, update emails are sent to subscribed users.
9. Every email includes a signed unsubscribe link.
10. The user can also unsubscribe from the in-app subscription drawer.

## Main Files

Core server files:

- [src/pages/api/subscribe.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/subscribe.ts)
- [src/pages/api/subscriptions.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/subscriptions.ts)
- [src/pages/api/unsubscribe.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/unsubscribe.ts)
- [src/utils/subscriptions.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/subscriptions.ts)
- [src/utils/sync.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/sync.ts)
- [src/utils/trackChanges.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/trackChanges.ts)
- [src/utils/email.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/email.ts)
- [src/utils/mailer.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/mailer.ts)
- [src/utils/subscriptionLinks.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/subscriptionLinks.ts)

Main frontend files:

- [src/components/SingleSubscriptionButton.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SingleSubscriptionButton.tsx)
- [src/components/SubscribtionButton.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SubscribtionButton.tsx)
- [src/components/SubscriptionFloater.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SubscriptionFloater.tsx)
- [src/components/SubscriptionForm.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SubscriptionForm.tsx)

Pages that surface subscription UI:

- [src/pages/eips/[eip-number]/index.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/eips/[eip-number]/index.tsx)
- [src/pages/ercs/[erc-number]/index.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/ercs/[erc-number]/index.tsx)
- [src/pages/rips/[rip-number]/index.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/rips/[rip-number]/index.tsx)
- [src/components/Layout.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/Layout.tsx)

## Where Users Subscribe

### 1. Proposal detail pages

Each individual proposal page shows a "Get Updates" row in its metadata table.

Examples:

- EIP detail page uses `SingleSubscriptionButton type="eips" id={eipNo}`
- ERC detail page uses `SingleSubscriptionButton type="ercs" id={ercNo}`
- RIP detail page uses `SingleSubscriptionButton type="rips" id={RIPNo}`

This is the main supported subscription path.

### 2. Global subscription drawer

The site layout includes a floating subscription drawer. It is rendered from:

- [src/components/Layout.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/Layout.tsx)

That drawer:

- loads the current user’s subscriptions,
- groups/filter them by type,
- allows in-app unsubscribe.

### 3. Generic subscription components

There is also a generic form/button layer:

- `SubscribtionButton`
- `SubscriptionForm`

These still point at the same APIs, but the current intended user journey is proposal-level subscribe from the detail pages.

## Authentication Model

Subscriptions are session-bound.

That means:

- the server determines the subscriber email from the active NextAuth session,
- the frontend no longer supplies arbitrary email addresses to subscription APIs,
- the current user can only list or modify their own subscriptions in-app.

Relevant auth configuration is in:

- [src/pages/api/auth/[...nextauth].ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/auth/[...nextauth].ts)

## Data Model

### MongoDB collection: `subscriptions`

Each subscription row stores:

- `email`
- `type`
- `id`
- `filter`
- `createdAt`

Defined in:

- [src/utils/subscriptions.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/subscriptions.ts)

Current supported values:

- `type`: `eips` | `ercs` | `rips`
- `filter`: `all` | `status` | `content`

Example logical record:

```json
{
  "email": "user@example.com",
  "type": "eips",
  "id": "1559",
  "filter": "all",
  "createdAt": "2026-03-13T10:00:00.000Z"
}
```

### MongoDB collection: `change_state`

This collection tracks the last processed Git commit SHA per `(type, id)` so the sync job knows where it left off.

Stored fields:

- `type`
- `id`
- `lastSha`
- `updatedAt`

Managed in:

- [src/utils/subscriptions.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/subscriptions.ts)

## API Endpoints

### `POST /api/subscribe`

File:

- [src/pages/api/subscribe.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/subscribe.ts)

Behavior:

- requires a signed-in session,
- reads `type`, `id`, `filter` from request body,
- uses `session.user.email` as the subscriber email,
- validates allowed `type` and `filter` values,
- checks for an existing identical subscription,
- inserts the subscription,
- sends a confirmation email,
- returns `{ success: true }` on success.

Duplicate subscriptions are rejected with `409`.

### `GET /api/subscriptions`

File:

- [src/pages/api/subscriptions.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/subscriptions.ts)

Behavior:

- requires a signed-in session,
- ignores caller-supplied email as the source of truth,
- fetches subscriptions for `session.user.email`,
- returns the current user’s subscription rows.

Note:

Some frontend callers still append `?email=...` in the URL. The server now uses the session email instead, so the query string is effectively redundant.

### `POST /api/unsubscribe`

File:

- [src/pages/api/unsubscribe.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/unsubscribe.ts)

Behavior:

- requires a signed-in session,
- reads `type`, `id`, `filter`,
- uses `session.user.email`,
- deletes the exact matching subscription row,
- returns `{ success: true }`.

### `GET /api/unsubscribe?token=...`

File:

- [src/pages/api/unsubscribe.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/unsubscribe.ts)

Behavior:

- used by email unsubscribe links,
- validates a signed token,
- extracts `email`, `type`, `id`, `filter`,
- deletes the exact matching subscription,
- returns a simple text response.

This path is intentionally stateless so a user can unsubscribe from an email client without needing to sign in first.

## Frontend Behavior

### `SingleSubscriptionButton`

File:

- [src/components/SingleSubscriptionButton.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SingleSubscriptionButton.tsx)

What it does:

- checks current subscription state on mount,
- if not signed in, sends user to `signIn(...)`,
- if signed in, posts to `/api/subscribe` or `/api/unsubscribe`,
- toggles button label and color based on subscription state.

Used on:

- EIP detail pages
- ERC detail pages
- RIP detail pages

### `SubscriptionFloater`

File:

- [src/components/SubscriptionFloater.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SubscriptionFloater.tsx)

What it does:

- fetches current user subscriptions,
- shows them in a drawer,
- filters by `all`, `eips`, `ercs`, `rips`,
- unsubscribes a specific `(type, id, filter)` record,
- displays whether the subscription is for `all`, `status`, or `content` changes.

### `SubscribtionButton`

File:

- [src/components/SubscribtionButton.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SubscribtionButton.tsx)

This is a more generic button wrapper around the same subscription APIs.

It now behaves consistently with the session-bound server flow.

### `SubscriptionForm`

File:

- [src/components/SubscriptionForm.tsx](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/components/SubscriptionForm.tsx)

What it does now:

- requires sign-in,
- lets the user choose `type`, `id`, and `filter`,
- posts to `/api/subscribe`,
- does not directly collect an arbitrary email anymore.

## Confirmation Email Flow

When a user subscribes successfully, the server sends a confirmation email immediately.

Implemented in:

- [src/utils/mailer.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/mailer.ts)

Transport config uses:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`

The confirmation email includes:

- proposal label such as `EIPS-1559`,
- a short success message,
- a direct unsubscribe link for that exact subscription.

## Change Detection and Update Emails

### Trigger points

Change sync can be triggered from:

- [src/pages/api/cron/sync.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/cron/sync.ts)
- [src/pages/api/webhooks/github.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/pages/api/webhooks/github.ts)

Both call:

- [src/utils/sync.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/sync.ts)

### Sync algorithm

`syncEipChanges()` does this:

1. Load all subscriptions.
2. Group them by `(type, id)`.
3. Read the last processed SHA from `change_state`.
4. Fetch new GitHub commits for the proposal file.
5. Convert commits into change events.
6. Split events into:
   - `status`
   - `content`
7. Filter per subscriber based on their `filter`.
8. Send update email if there are relevant events.
9. Generate an RSS file for that proposal.
10. If all subscriber emails succeeded, advance `lastSha`.

### How file tracking works

The GitHub file path is resolved from `type` and `id` in:

- [src/utils/trackChanges.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/trackChanges.ts)

Mappings:

- `eips` -> `ethereum/EIPs` -> `EIPS/eip-{id}.md`
- `ercs` -> `ethereum/EIPs` -> `ERCS/erc-{id}.md`
- `rips` -> `ethereum-cat-herders/RIPs` -> `RIPS/rip-{id}.md`

This is why subscriptions must point to a real proposal id. A fake id like `"all"` would not map to a real file.

### Event generation

Each tracked commit becomes a `content` event.

If the parsed `status:` field changes between revisions, an additional `status` event is created.

That logic lives in:

- [src/utils/trackChanges.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/trackChanges.ts)

### Update email rendering

Update emails are built in:

- [src/utils/email.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/email.ts)

These emails include:

- the proposal label,
- a table of detected changes,
- commit links,
- author and timestamp,
- an unsubscribe link for the exact subscription.

## Unsubscribe Token Design

The email unsubscribe flow uses a signed token helper in:

- [src/utils/subscriptionLinks.ts](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/src/utils/subscriptionLinks.ts)

The token encodes:

- `email`
- `type`
- `id`
- `filter`
- token version

The token is signed with `NEXTAUTH_SECRET` via HMAC SHA-256.

This gives the app a way to verify that the unsubscribe request was created by the server and was not tampered with.

## Supported Filters

The system currently supports three subscription scopes per proposal:

- `all`: send both content and status updates
- `status`: send only status transitions
- `content`: send any content changes

The main detail-page buttons currently subscribe with `filter: "all"`.

The data model and backend already support `status` and `content`, and the drawer can display them.

## What Changed Recently

The subscription flow was tightened up to fix a few important problems:

- subscriptions are now tied to the signed-in session on the server,
- in-app listing no longer trusts arbitrary email query input,
- in-app unsubscribe no longer trusts arbitrary posted email,
- email notifications now include working unsubscribe links,
- misleading aggregate "subscribe to all EIPs/ERCs/RIPs" buttons were removed from overview pages because they did not map to a valid tracked file.

## Current Limitations

### 1. No global repository-wide subscription

This system does not support:

- "all EIPs"
- "all ERCs"
- "all RIPs"

It is proposal-specific by design.

### 2. Some frontend calls still include `?email=...`

Some components still request:

- `/api/subscriptions?email=${session.user.email}`

This is harmless now because the server uses session email, but the query parameter is legacy and can be cleaned up later.

### 3. UI feedback still uses `alert(...)`

Several components still use browser alerts for success/error states instead of Chakra toasts.

This is a UX issue, not a functional issue.

### 4. Token unsubscribe response is plain text

The email unsubscribe route currently returns a simple text response, not a styled confirmation page.

### 5. No tests around subscription flow yet

There are no dedicated automated tests in this repo for:

- subscription API auth behavior,
- duplicate prevention,
- tokenized unsubscribe,
- sync-driven email dispatch.

## Environment Variables Relevant to Subscriptions

Required for DB/auth/email:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`
- `GITHUB_TOKEN`

Why each matters:

- `MONGODB_URI`: stores subscriptions and sync state
- `NEXTAUTH_SECRET`: signs session tokens and unsubscribe links
- `NEXTAUTH_URL`: builds absolute unsubscribe URLs
- email variables: send confirmation and update emails
- `GITHUB_TOKEN`: reads proposal file history from GitHub

See:

- [.env.example](/Users/dhanushlnaik/Workspace/Dev/Avarch/EIPUI/.env.example)

## Recommended Mental Model

If you want to understand the system quickly, think of it as two layers:

### Layer 1: Subscription registry

MongoDB stores "user X wants updates for proposal Y with filter Z".

### Layer 2: Change broadcast

A sync process checks proposal files in GitHub and sends emails when matching changes appear.

That separation is important:

- the API layer manages who is subscribed,
- the sync layer decides when an update is worth sending.

## Future Improvements

If we continue this area, the natural next improvements are:

1. Replace all `alert(...)` usage with Chakra toasts.
2. Remove the legacy `?email=...` query usage in frontend subscription fetches.
3. Add tests for subscribe, unsubscribe, and token validation.
4. Add a branded unsubscribe confirmation page instead of plain text.
5. Add explicit filter selection in the individual proposal page UI.

