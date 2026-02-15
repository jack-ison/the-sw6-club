# Security Hardening Checklist

## What is enforced in code/schema

- Row Level Security on app tables.
- Admin access checked server-side via `public.is_configured_admin()`.
- Admin allowlist stored in `public.app_admins` keyed by `auth.users.id`.
- Forum reads restricted to authenticated users.
- Forum thread/reply creation protected by DB-side rate limits.

## Release checklist (before shipping)

1. Run latest SQL migration from `/Users/jackison/Documents/First Codex Project/Web Apps/supabase-schema.sql`.
2. In Supabase Auth settings:
   - Enable email confirmation.
   - Configure SMTP provider and sender domain.
   - Review signup/email rate limits.
3. In Supabase API settings:
   - Confirm no `service_role` key is exposed client-side.
4. In Supabase Storage:
   - Verify `avatars` bucket policies match expected public/private behavior.
5. In app verification:
   - Logged out: no admin controls visible.
   - Non-admin: no admin controls visible.
   - Admin: admin controls visible and functional.

## Optional next steps

- Add hCaptcha/Turnstile for signup and forum posting.
- Add anomaly logging for repeated failed private-league joins.
- Rotate admin assignment to a secured SQL function guarded by existing admins.
