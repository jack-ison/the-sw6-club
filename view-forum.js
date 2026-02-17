let listenersBound = false;
let forumSortMode = "new";
let activeReplyParentId = "";
const inlineReplyDraftByParent = new Map();
const votePendingByComment = new Set();

function getCurrentUserId(state) {
  return state?.user?.id || state?.session?.user?.id || "";
}

function normalizeThreadRow(row) {
  return {
    id: row.id,
    title: row.title || "Untitled",
    body: row.body || "",
    user_id: row.user_id || row.created_by || "",
    created_by: row.created_by || row.user_id || "",
    author_display_name: row.author_display_name || "Player",
    created_at: row.created_at || new Date().toISOString(),
    last_activity_at: row.last_activity_at || row.created_at || new Date().toISOString(),
    comment_count: Number.isFinite(Number(row.comment_count)) ? Number(row.comment_count) : 0
  };
}

function normalizeCommentRow(row) {
  return {
    id: row.comment_id || row.id,
    thread_id: row.thread_id,
    parent_comment_id: row.parent_comment_id || null,
    body: row.comment_body ?? row.body ?? "",
    is_deleted: Boolean(row.comment_is_deleted ?? row.is_deleted),
    created_at: row.comment_created_at || row.created_at || new Date().toISOString(),
    author_display_name: row.comment_author_display_name || row.author_display_name || "Player",
    created_by: row.comment_created_by || row.created_by || row.user_id || "",
    upvotes: Number(row.upvotes || 0),
    downvotes: Number(row.downvotes || 0),
    score: Number(row.score || 0),
    reply_count: Number(row.reply_count || 0),
    my_vote: Number(row.my_vote || 0)
  };
}

function sortThreads(threads) {
  const rows = [...threads];
  if (forumSortMode === "top") {
    rows.sort((a, b) => {
      const byComments = (b.comment_count || 0) - (a.comment_count || 0);
      if (byComments !== 0) return byComments;
      return new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime();
    });
    return rows;
  }
  rows.sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
  return rows;
}

function bindListeners(ctx) {
  if (listenersBound) {
    return;
  }
  const { els } = ctx;
  if (els.forumThreadFormEl) {
    els.forumThreadFormEl.addEventListener("submit", (event) => onCreateForumThread(ctx, event));
  }
  if (els.forumReplyFormEl) {
    els.forumReplyFormEl.addEventListener("submit", (event) => onCreateForumReply(ctx, event, null));
  }
  if (els.forumThreadListEl) {
    els.forumThreadListEl.addEventListener("click", (event) => onForumThreadListClick(ctx, event));
  }
  if (els.forumReplyListEl) {
    els.forumReplyListEl.addEventListener("click", (event) => onForumReplyListClick(ctx, event));
    els.forumReplyListEl.addEventListener("submit", (event) => onInlineReplySubmit(ctx, event));
  }
  if (els.forumBackBtnEl) {
    els.forumBackBtnEl.addEventListener("click", () => onForumBackToList(ctx));
  }
  if (els.forumDeleteThreadBtnEl) {
    els.forumDeleteThreadBtnEl.addEventListener("click", () => onDeleteForumThread(ctx));
  }
  if (els.forumSortNewBtnEl) {
    els.forumSortNewBtnEl.addEventListener("click", () => {
      forumSortMode = "new";
      ctx.render();
    });
  }
  if (els.forumSortTopBtnEl) {
    els.forumSortTopBtnEl.addEventListener("click", () => {
      forumSortMode = "top";
      ctx.render();
    });
  }
  listenersBound = true;
}

function getForumThreadsCache(ctx) {
  const cached = ctx.readObjectCache("cfc-forum-threads-cache-v1", 1, 2 * 60 * 1000);
  return Array.isArray(cached) ? cached : [];
}

function setForumThreadsCache(ctx, threads) {
  ctx.writeObjectCache("cfc-forum-threads-cache-v1", 1, threads);
}

async function loadForumThreadById(ctx, threadId) {
  if (!ctx.state.client || !threadId) {
    return null;
  }
  const { data, error } = await ctx.state.client
    .from("forum_threads")
    .select("id, title, body, user_id, created_by, author_display_name, created_at, last_activity_at, comment_count")
    .eq("id", threadId)
    .maybeSingle();
  if (error) {
    return null;
  }
  return data ? normalizeThreadRow(data) : null;
}

async function refreshForumThreadsFromServer(ctx) {
  const { state } = ctx;
  if (!state.client) {
    return false;
  }
  const { data, error } = await state.client
    .from("forum_threads")
    .select("id, title, body, user_id, created_by, author_display_name, created_at, last_activity_at, comment_count")
    .order("last_activity_at", { ascending: false })
    .limit(50);
  if (error) {
    state.forumStatus = "The Concourse is unavailable right now.";
    return false;
  }
  state.forumThreads = Array.isArray(data) ? data.map(normalizeThreadRow) : [];
  setForumThreadsCache(ctx, state.forumThreads);

  if (state.activeForumThreadId && !state.forumThreads.some((thread) => thread.id === state.activeForumThreadId)) {
    const deepLinkedThread = await loadForumThreadById(ctx, state.activeForumThreadId);
    if (deepLinkedThread) {
      state.forumThreads = [deepLinkedThread, ...state.forumThreads];
    } else {
      state.activeForumThreadId = null;
      state.forumReplies = [];
      state.forumStatus = "Thread not found.";
    }
  }
  return true;
}

async function loadForumThreads(ctx, options = {}) {
  const force = Boolean(options.force);
  const background = Boolean(options.background);
  const { state, runtime } = ctx;
  if (!state.client) {
    state.forumThreads = [];
    return;
  }
  if (!force && state.forumThreads.length === 0) {
    const cachedThreads = getForumThreadsCache(ctx);
    if (cachedThreads.length > 0) {
      state.forumThreads = cachedThreads.map(normalizeThreadRow);
    }
  }
  if (!force && background) {
    if (!runtime.forumThreadsRefreshPromise) {
      runtime.forumThreadsRefreshPromise = refreshForumThreadsFromServer(ctx).finally(() => {
        runtime.forumThreadsRefreshPromise = null;
        ctx.render();
      });
    }
    return;
  }
  if (!force && runtime.forumThreadsRefreshPromise) {
    await runtime.forumThreadsRefreshPromise;
    return;
  }
  runtime.forumThreadsRefreshPromise = refreshForumThreadsFromServer(ctx).finally(() => {
    runtime.forumThreadsRefreshPromise = null;
  });
  await runtime.forumThreadsRefreshPromise;
}

async function loadForumReplies(ctx, threadId) {
  const { state } = ctx;
  if (!state.client || !threadId) {
    state.forumReplies = [];
    return;
  }

  const rpcResult = await state.client.rpc("fetch_thread_with_comments", { p_thread_id: threadId });
  if (!rpcResult.error && Array.isArray(rpcResult.data)) {
    const rows = rpcResult.data.filter((row) => row.comment_id).map(normalizeCommentRow);
    state.forumReplies = rows;
    const threadFromRpc = rpcResult.data.find((row) => row.thread_id);
    if (threadFromRpc) {
      const nextThread = normalizeThreadRow({
        id: threadFromRpc.thread_id,
        title: threadFromRpc.thread_title,
        body: threadFromRpc.thread_body,
        author_display_name: threadFromRpc.thread_author_display_name,
        created_at: threadFromRpc.thread_created_at,
        last_activity_at: threadFromRpc.thread_last_activity_at,
        comment_count: threadFromRpc.thread_comment_count,
        created_by: state.forumThreads.find((t) => t.id === threadId)?.created_by || "",
        user_id: state.forumThreads.find((t) => t.id === threadId)?.user_id || ""
      });
      const existingIndex = state.forumThreads.findIndex((row) => row.id === threadId);
      if (existingIndex >= 0) {
        state.forumThreads[existingIndex] = { ...state.forumThreads[existingIndex], ...nextThread };
      }
    }
    return;
  }

  const currentUserId = getCurrentUserId(state);
  const [commentsResult, votesResult] = await Promise.all([
    state.client
      .from("forum_comments")
      .select("id, thread_id, parent_comment_id, body, is_deleted, created_at, created_by, author_display_name, upvotes, downvotes, score, reply_count")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(500),
    currentUserId
      ? state.client.from("forum_comment_votes").select("comment_id, vote").eq("user_id", currentUserId)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (commentsResult.error) {
    state.forumReplies = [];
    return;
  }

  const voteMap = new Map((votesResult.data || []).map((row) => [row.comment_id, Number(row.vote || 0)]));
  state.forumReplies = (commentsResult.data || []).map((row) => normalizeCommentRow({ ...row, my_vote: voteMap.get(row.id) || 0 }));
}

async function openForumThreadById(ctx, threadId) {
  ctx.state.activeForumThreadId = threadId;
  activeReplyParentId = "";
  inlineReplyDraftByParent.clear();
  ctx.syncRouteHash();
  await loadForumReplies(ctx, threadId);
  if (typeof ctx.markForumNotificationsRead === "function") {
    await ctx.markForumNotificationsRead(threadId);
  }
  ctx.render();
}

function onForumBackToList(ctx) {
  ctx.state.activeForumThreadId = null;
  ctx.state.forumReplies = [];
  activeReplyParentId = "";
  inlineReplyDraftByParent.clear();
  ctx.syncRouteHash();
  ctx.render();
}

async function onCreateForumThread(ctx, event) {
  event.preventDefault();
  const { state, els } = ctx;
  if (!state.client || !getCurrentUserId(state) || (typeof ctx.canWriteActions === "function" && !ctx.canWriteActions())) {
    state.forumStatus = "Configuration error. Posting is temporarily unavailable.";
    ctx.render();
    return;
  }

  const title = String(els.forumThreadTitleInputEl?.value || "").trim();
  const body = String(els.forumThreadBodyInputEl?.value || "").trim();
  if (!title || !body) {
    return;
  }

  if (els.forumThreadSubmitBtnEl) {
    els.forumThreadSubmitBtnEl.disabled = true;
    els.forumThreadSubmitBtnEl.textContent = "Posting...";
  }

  let threadId = null;
  let error = null;
  const rpcResult = await state.client.rpc("create_forum_thread", {
    p_title: title,
    p_body: body,
    p_author_display_name: ctx.getCurrentUserDisplayName()
  });
  if (!rpcResult.error) {
    threadId = rpcResult.data || null;
  } else {
    const fallback = await state.client
      .from("forum_threads")
      .insert({
        user_id: getCurrentUserId(state),
        created_by: getCurrentUserId(state),
        author_display_name: ctx.getCurrentUserDisplayName(),
        title,
        body,
        last_activity_at: new Date().toISOString()
      })
      .select("id")
      .single();
    error = fallback.error;
    threadId = fallback.data?.id || null;
  }

  if (els.forumThreadSubmitBtnEl) {
    els.forumThreadSubmitBtnEl.disabled = false;
    els.forumThreadSubmitBtnEl.textContent = "Post Thread";
  }

  if (error) {
    state.forumStatus = error.message;
    ctx.render();
    return;
  }

  state.forumStatus = "Thread posted.";
  if (els.forumThreadFormEl) {
    els.forumThreadFormEl.reset();
  }
  await loadForumThreads(ctx, { force: true });
  state.activeForumThreadId = threadId;
  ctx.syncRouteHash();
  await loadForumReplies(ctx, state.activeForumThreadId);
  ctx.render();
}

async function onCreateForumReply(ctx, event, parentCommentId) {
  event.preventDefault();
  const { state, els } = ctx;
  if (!state.client || !getCurrentUserId(state) || !state.activeForumThreadId || (typeof ctx.canWriteActions === "function" && !ctx.canWriteActions())) {
    state.forumStatus = "Configuration error. Posting is temporarily unavailable.";
    ctx.render();
    return;
  }

  const sourceTextarea = parentCommentId
    ? event.target.querySelector("textarea[name='inline-reply-body']")
    : els.forumReplyBodyInputEl;
  const body = String(sourceTextarea?.value || "").trim();
  if (!body) {
    return;
  }

  const submitBtn = parentCommentId
    ? event.target.querySelector("button[type='submit']")
    : els.forumReplySubmitBtnEl;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Posting...";
  }

  let error = null;
  const rpcResult = await state.client.rpc("create_forum_reply", {
    p_thread_id: state.activeForumThreadId,
    p_body: body,
    p_author_display_name: ctx.getCurrentUserDisplayName(),
    p_parent_comment_id: parentCommentId || null
  });

  if (rpcResult.error) {
    const fallback = await state.client.from("forum_comments").insert({
      thread_id: state.activeForumThreadId,
      created_by: getCurrentUserId(state),
      author_display_name: ctx.getCurrentUserDisplayName(),
      body,
      parent_comment_id: parentCommentId || null
    });
    error = fallback.error;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = parentCommentId ? "Reply" : "Post Comment";
  }

  if (error) {
    state.forumStatus = error.message;
    ctx.render();
    return;
  }

  state.forumStatus = parentCommentId ? "Reply posted." : "Comment posted.";
  if (sourceTextarea) {
    sourceTextarea.value = "";
  }
  if (parentCommentId) {
    inlineReplyDraftByParent.delete(parentCommentId);
    activeReplyParentId = "";
  }

  await loadForumReplies(ctx, state.activeForumThreadId);
  await loadForumThreads(ctx, { force: true });
  ctx.render();
}

async function onForumThreadListClick(ctx, event) {
  const openBtn = event.target.closest("button[data-thread-id]");
  if (!openBtn) {
    return;
  }
  const threadId = openBtn.dataset.threadId || "";
  if (!threadId) {
    return;
  }
  await openForumThreadById(ctx, threadId);
}

async function onVoteComment(ctx, commentId, nextVote) {
  const { state } = ctx;
  if (!state.client || !getCurrentUserId(state) || !commentId || votePendingByComment.has(commentId)) {
    return;
  }
  const current = state.forumReplies.find((row) => row.id === commentId);
  if (!current || current.is_deleted) {
    return;
  }

  const original = {
    upvotes: current.upvotes,
    downvotes: current.downvotes,
    score: current.score,
    my_vote: current.my_vote
  };

  const removeVote = current.my_vote === nextVote;
  const optimisticVote = removeVote ? 0 : nextVote;
  if (current.my_vote === 1) {
    current.upvotes = Math.max(0, current.upvotes - 1);
    current.score -= 1;
  } else if (current.my_vote === -1) {
    current.downvotes = Math.max(0, current.downvotes - 1);
    current.score += 1;
  }
  if (optimisticVote === 1) {
    current.upvotes += 1;
    current.score += 1;
  } else if (optimisticVote === -1) {
    current.downvotes += 1;
    current.score -= 1;
  }
  current.my_vote = optimisticVote;
  votePendingByComment.add(commentId);
  ctx.render();

  const { data, error } = await state.client.rpc("vote_on_comment", {
    p_comment_id: commentId,
    p_vote: optimisticVote
  });

  votePendingByComment.delete(commentId);
  if (error) {
    current.upvotes = original.upvotes;
    current.downvotes = original.downvotes;
    current.score = original.score;
    current.my_vote = original.my_vote;
    state.forumStatus = error.message || "Vote failed.";
    ctx.render();
    return;
  }

  const row = Array.isArray(data) ? data[0] : null;
  if (row) {
    current.upvotes = Number(row.upvotes || 0);
    current.downvotes = Number(row.downvotes || 0);
    current.score = Number(row.score || 0);
    current.my_vote = Number(row.my_vote || 0);
  }
  state.forumStatus = "";
  ctx.render();
}

function onForumReplyListClick(ctx, event) {
  const voteBtn = event.target.closest("button[data-vote-comment-id]");
  if (voteBtn) {
    const commentId = voteBtn.dataset.voteCommentId || "";
    const vote = Number(voteBtn.dataset.voteValue || 0);
    if (commentId && (vote === 1 || vote === -1)) {
      onVoteComment(ctx, commentId, vote);
    }
    return;
  }

  const replyBtn = event.target.closest("button[data-reply-parent-id]");
  if (replyBtn) {
    const parentId = replyBtn.dataset.replyParentId || "";
    activeReplyParentId = activeReplyParentId === parentId ? "" : parentId;
    ctx.render();
    return;
  }

  const cancelBtn = event.target.closest("button[data-cancel-reply-parent-id]");
  if (cancelBtn) {
    activeReplyParentId = "";
    ctx.render();
  }
}

function onInlineReplySubmit(ctx, event) {
  const form = event.target.closest("form[data-inline-reply-form='true']");
  if (!form) {
    return;
  }
  const parentId = form.dataset.parentCommentId || null;
  onCreateForumReply(ctx, event, parentId);
}

async function onDeleteForumThread(ctx) {
  const { state, els } = ctx;
  const activeThread = state.forumThreads.find((thread) => thread.id === state.activeForumThreadId) || null;
  if (!state.client || !getCurrentUserId(state) || !activeThread) {
    return;
  }
  const confirmed = window.confirm("Delete this thread and all comments? This cannot be undone.");
  if (!confirmed) {
    return;
  }

  if (els.forumDeleteThreadBtnEl) {
    els.forumDeleteThreadBtnEl.disabled = true;
    els.forumDeleteThreadBtnEl.textContent = "Deleting...";
  }
  const { error } = await state.client.from("forum_threads").delete().eq("id", activeThread.id);
  if (els.forumDeleteThreadBtnEl) {
    els.forumDeleteThreadBtnEl.disabled = false;
    els.forumDeleteThreadBtnEl.textContent = "Delete Thread";
  }
  if (error) {
    state.forumStatus = error.message || "Could not delete thread.";
    ctx.render();
    return;
  }

  state.forumStatus = "Thread deleted.";
  state.activeForumThreadId = null;
  state.forumReplies = [];
  activeReplyParentId = "";
  inlineReplyDraftByParent.clear();
  await loadForumThreads(ctx, { force: true });
  ctx.syncRouteHash();
  ctx.render();
}

function buildCommentChildren(comments) {
  const byParent = new Map();
  comments.forEach((comment) => {
    const key = comment.parent_comment_id || "root";
    if (!byParent.has(key)) {
      byParent.set(key, []);
    }
    byParent.get(key).push(comment);
  });
  return byParent;
}

function renderInlineReplyForm(ctx, parentId) {
  const form = document.createElement("form");
  form.className = "mini-form forum-inline-reply-form";
  form.dataset.inlineReplyForm = "true";
  form.dataset.parentCommentId = parentId;

  const label = document.createElement("label");
  label.textContent = "Reply";
  const textarea = document.createElement("textarea");
  textarea.name = "inline-reply-body";
  textarea.rows = 3;
  textarea.maxLength = 1500;
  textarea.required = true;
  textarea.value = inlineReplyDraftByParent.get(parentId) || "";
  textarea.addEventListener("input", () => {
    inlineReplyDraftByParent.set(parentId, textarea.value);
  });
  label.appendChild(textarea);

  const actions = document.createElement("div");
  actions.className = "forum-inline-reply-actions";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "forum-action-link";
  submitBtn.textContent = "Reply";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "forum-action-link";
  cancelBtn.dataset.cancelReplyParentId = parentId;
  cancelBtn.textContent = "Cancel";

  actions.appendChild(submitBtn);
  actions.appendChild(cancelBtn);
  form.appendChild(label);
  form.appendChild(actions);
  return form;
}

function renderCommentNode(ctx, comment, byParent, depth) {
  const li = document.createElement("li");
  li.className = `forum-comment depth-${Math.min(depth, 3)}`;

  const shell = document.createElement("div");
  shell.className = "forum-comment-shell";

  const voteRail = document.createElement("div");
  voteRail.className = "forum-vote-rail";

  const meta = document.createElement("p");
  meta.className = "status no-margin";
  meta.textContent = `${comment.author_display_name || "Player"} • ${ctx.formatKickoff(comment.created_at)}`;

  const body = document.createElement("p");
  body.className = "no-margin forum-comment-body";
  body.textContent = comment.is_deleted ? "[deleted]" : comment.body || "";

  const actions = document.createElement("div");
  actions.className = "forum-comment-actions";

  const score = document.createElement("span");
  score.className = "forum-comment-score";
  score.textContent = `${comment.score || 0}`;

  const upvoteBtn = document.createElement("button");
  upvoteBtn.type = "button";
  upvoteBtn.className = "forum-vote-btn";
  upvoteBtn.dataset.voteCommentId = comment.id;
  upvoteBtn.dataset.voteValue = "1";
  upvoteBtn.textContent = "▲";
  upvoteBtn.disabled = comment.is_deleted || votePendingByComment.has(comment.id);
  upvoteBtn.classList.toggle("active", comment.my_vote === 1);

  const downvoteBtn = document.createElement("button");
  downvoteBtn.type = "button";
  downvoteBtn.className = "forum-vote-btn";
  downvoteBtn.dataset.voteCommentId = comment.id;
  downvoteBtn.dataset.voteValue = "-1";
  downvoteBtn.textContent = "▼";
  downvoteBtn.disabled = comment.is_deleted || votePendingByComment.has(comment.id);
  downvoteBtn.classList.toggle("active", comment.my_vote === -1);

  voteRail.appendChild(upvoteBtn);
  voteRail.appendChild(score);
  voteRail.appendChild(downvoteBtn);

  if (!comment.is_deleted && depth < 3) {
    const replyBtn = document.createElement("button");
    replyBtn.type = "button";
    replyBtn.className = "forum-action-link";
    replyBtn.dataset.replyParentId = comment.id;
    replyBtn.textContent = "Reply";
    actions.appendChild(replyBtn);
  }

  const content = document.createElement("div");
  content.className = "forum-comment-content";
  content.appendChild(meta);
  content.appendChild(body);
  content.appendChild(actions);

  shell.appendChild(voteRail);
  shell.appendChild(content);
  li.appendChild(shell);

  if (activeReplyParentId === comment.id) {
    li.appendChild(renderInlineReplyForm(ctx, comment.id));
  }

  const children = byParent.get(comment.id) || [];
  if (children.length > 0) {
    const childList = document.createElement("ul");
    childList.className = "forum-comment-children";
    if (depth >= 3) {
      const more = document.createElement("li");
      more.className = "status";
      more.textContent = `View more replies (${children.length})`;
      childList.appendChild(more);
      children.forEach((child) => {
        childList.appendChild(renderCommentNode(ctx, child, byParent, 3));
      });
    } else {
      children.forEach((child) => {
        childList.appendChild(renderCommentNode(ctx, child, byParent, depth + 1));
      });
    }
    li.appendChild(childList);
  }

  return li;
}

export function render(ctx) {
  const { state, els } = ctx;
  if (!els.forumThreadListEl || !els.forumStatusEl || !els.forumThreadDetailEl) {
    return;
  }

  const isAuthed = Boolean(getCurrentUserId(state));
  const activeThread = state.forumThreads.find((thread) => thread.id === state.activeForumThreadId) || null;
  const isThreadView = Boolean(activeThread);

  if (els.forumAuthGateEl) {
    els.forumAuthGateEl.classList.toggle("hidden", isAuthed);
  }
  if (els.forumThreadFormEl) {
    els.forumThreadFormEl.classList.toggle("hidden", !isAuthed || isThreadView);
  }
  if (els.forumReplyFormEl) {
    els.forumReplyFormEl.classList.toggle("hidden", !isAuthed || !isThreadView);
  }
  if (els.forumSortToolbarEl) {
    els.forumSortToolbarEl.classList.toggle("hidden", isThreadView);
  }
  if (els.forumSortNewBtnEl) {
    const active = forumSortMode === "new";
    els.forumSortNewBtnEl.classList.toggle("active", active);
    els.forumSortNewBtnEl.setAttribute("aria-pressed", String(active));
  }
  if (els.forumSortTopBtnEl) {
    const active = forumSortMode === "top";
    els.forumSortTopBtnEl.classList.toggle("active", active);
    els.forumSortTopBtnEl.setAttribute("aria-pressed", String(active));
  }

  els.forumStatusEl.textContent = state.forumStatus || "";
  els.forumThreadListEl.classList.toggle("hidden", isThreadView);

  els.forumThreadListEl.textContent = "";
  const sortedThreads = sortThreads(state.forumThreads || []);
  if (sortedThreads.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No threads yet.";
    els.forumThreadListEl.appendChild(li);
  } else {
    sortedThreads.forEach((thread) => {
      const li = document.createElement("li");
      li.className = "forum-thread-row";

      const title = document.createElement("p");
      title.className = "no-margin forum-thread-title";
      title.textContent = thread.title || "Untitled";

      const meta = document.createElement("p");
      meta.className = "status no-margin";
      meta.textContent = `${thread.author_display_name || "Player"} • ${ctx.formatKickoff(thread.created_at)}`;

      const activity = document.createElement("p");
      activity.className = "status no-margin";
      activity.textContent = `${thread.comment_count || 0} comments • Last activity ${ctx.formatKickoff(thread.last_activity_at || thread.created_at)}`;

      const excerpt = document.createElement("p");
      excerpt.className = "no-margin";
      excerpt.textContent = String(thread.body || "").slice(0, 180);

      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "forum-action-link";
      openBtn.dataset.threadId = thread.id;
      openBtn.textContent = "Open Thread";

      li.appendChild(title);
      li.appendChild(meta);
      li.appendChild(activity);
      li.appendChild(excerpt);
      li.appendChild(openBtn);
      els.forumThreadListEl.appendChild(li);
    });
  }

  els.forumThreadDetailEl.classList.toggle("hidden", !activeThread);
  if (!activeThread) {
    return;
  }

  if (els.forumThreadDetailTitleEl) {
    els.forumThreadDetailTitleEl.textContent = activeThread.title || "Thread";
  }
  if (els.forumThreadDetailMetaEl) {
    els.forumThreadDetailMetaEl.textContent = `${activeThread.author_display_name || "Player"} • ${ctx.formatKickoff(activeThread.created_at)}`;
  }
  if (els.forumThreadDetailBodyEl) {
    els.forumThreadDetailBodyEl.textContent = activeThread.body || "";
  }
  if (els.forumDeleteThreadBtnEl) {
    els.forumDeleteThreadBtnEl.classList.toggle("hidden", !isAuthed);
  }

  if (els.forumReplyListEl) {
    els.forumReplyListEl.textContent = "";
    const comments = Array.isArray(state.forumReplies) ? state.forumReplies : [];
    if (comments.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = "No comments yet.";
      els.forumReplyListEl.appendChild(li);
    } else {
      const byParent = buildCommentChildren(comments);
      const topLevel = byParent.get("root") || [];
      topLevel.forEach((comment) => {
        els.forumReplyListEl.appendChild(renderCommentNode(ctx, comment, byParent, 1));
      });
    }
  }
}

export async function onEnter(ctx) {
  bindListeners(ctx);
  if (typeof ctx.loadForumUnreadCount === "function") {
    await ctx.loadForumUnreadCount();
  }
  await loadForumThreads(ctx, { background: true });
  if (ctx.state.activeForumThreadId) {
    await loadForumReplies(ctx, ctx.state.activeForumThreadId);
    if (typeof ctx.markForumNotificationsRead === "function") {
      await ctx.markForumNotificationsRead(ctx.state.activeForumThreadId);
    }
  }
  ctx.render();
}
