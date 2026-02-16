# The SW6 Club

## Local Run

Build the deployable output, then run a static server from `dist/`:

```bash
npm run build
npx serve dist
```

## Auth Gating Verification Checklist

1. Logged out:
   - Header shows only `Sign in` and `Sign up`.
   - `Edit profile` and `Sign out` are hidden.
   - Predict, Leagues, and The Concourse show the `Sign in to use this.` CTA card.
   - Page source does not contain `Admin Console`.

2. Logged in (non-admin):
   - Header shows `Edit profile` and `Sign out`.
   - Predict, Leagues, and The Concourse auth-gated UI is visible.
   - No `Admin Console` node exists in the DOM.

3. Logged in (admin allowlist):
   - `Admin Console` is rendered in Leagues and delete actions work.

## Admin Allowlist

Admin users are controlled in `/Users/jackison/Documents/First Codex Project/Web Apps/app.js` with:

- `ADMIN_EMAILS`
