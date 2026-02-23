# No-Break Deploy Process

Use this checklist before pushing to `main`.

## 1) Pre-flight

1. Pull latest `main`.
2. Run local build:
   - `npm run build`
3. Run smoke checks:
   - `npm run smoke`

## 2) Manual critical path checks

1. Sign up + confirm email + sign in.
2. Save/update a prediction and confirm immediate button feedback.
3. Refresh and verify prediction persists.
4. Open Leagues and verify leaderboard loads.
5. If admin: save a match result and confirm points update.

## 3) Release

1. Commit only intended files.
2. Push to `main`.
3. Wait for Vercel production deployment to complete.
4. Hard-refresh site and re-check:
   - next fixture visible
   - prediction submit works
   - leaderboard loads

## 4) Fast rollback

1. In Vercel: Project -> Deployments.
2. Find last known good deployment.
3. Click `...` -> `Promote to Production`.
4. Post a short status note to users if needed.

## 5) Rules for safer shipping

1. Keep schema migrations separate from UI changes where possible.
2. Prefer feature flags for incomplete features.
3. Never expose `service_role` keys in frontend/runtime config.
