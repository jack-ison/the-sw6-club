# Forum Threading + Votes Notes

## Step 0: Existing schema/code findings

Current frontend forum code (`/Users/jackison/Documents/First Codex Project/Web Apps/view-forum.js`) used:
- `forum_threads`
  - fields used: `id, title, body, user_id, author_display_name, created_at`
- `forum_replies`
  - fields used: `id, thread_id, body, user_id, author_display_name, created_at`
- RPCs:
  - `create_forum_thread(p_title, p_body, p_author_display_name)`
  - `create_forum_reply(p_thread_id, p_body, p_author_display_name)`

Current SQL baseline (`/Users/jackison/Documents/First Codex Project/Web Apps/supabase-schema.sql`) defines:
- `public.forum_threads` with `id uuid`, `user_id`, `author_display_name`, `title`, `body`, `created_at`.
- `public.forum_replies` with `id uuid`, `thread_id`, `user_id`, `author_display_name`, `body`, `created_at`.
- Authenticated-only select/insert RLS for forum tables.
- Rate-limited posting via `forum_post_actions`, `can_create_forum_post`, and RPC wrappers.

Assumptions used for this upgrade:
- Keep UUID ids for forum entities to avoid breaking existing deployed data.
- Standardize replies into `forum_comments` (renaming existing `forum_replies` when present).
- Keep forum reads authenticated-only.

## What this change adds
- Threaded comments via `parent_comment_id`.
- Vote model with one vote per user per comment (`forum_comment_votes`) and toggle semantics.
- Cached counters (`upvotes`, `downvotes`, `score`, `reply_count`, `comment_count`, `last_activity_at`) maintained by triggers.
- RPCs for simpler frontend logic:
  - `vote_on_comment(p_comment_id, p_vote)`
  - `fetch_thread_with_comments(p_thread_id)`

## Manual test checklist

1. Sign in and open **The Concourse**.
2. Create a thread.
3. Open thread and post a top-level comment.
4. Click **Reply** on that comment and submit inline reply.
5. Add a second nested reply (depth 2/3) and verify nesting.
6. Click upvote on a comment:
   - score increments
   - upvote button highlights
7. Click upvote again:
   - vote removed
   - score returns
8. Click downvote:
   - score decrements
   - downvote button highlights
9. Refresh page and confirm vote state/counters persist.
10. Confirm signed-out users cannot read forum content.
11. Confirm signed-out DOM does not include post forms (handled by auth DOM gating in app runtime).

## Optional smoke (if Playwright is available)
- sign in
- open a thread
- post a comment
- reply to that comment
- upvote then remove vote
