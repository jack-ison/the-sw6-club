let listenersBound = false;

function bindListeners(ctx) {
  if (listenersBound) {
    return;
  }
  const { els } = ctx;
  if (els.forumThreadFormEl) {
    els.forumThreadFormEl.addEventListener("submit", (event) => onCreateForumThread(ctx, event));
  }
  if (els.forumReplyFormEl) {
    els.forumReplyFormEl.addEventListener("submit", (event) => onCreateForumReply(ctx, event));
  }
  if (els.forumThreadListEl) {
    els.forumThreadListEl.addEventListener("click", (event) => onForumThreadListClick(ctx, event));
  }
  if (els.forumBackBtnEl) {
    els.forumBackBtnEl.addEventListener("click", () => onForumBackToList(ctx));
  }
  if (els.forumDeleteThreadBtnEl) {
    els.forumDeleteThreadBtnEl.addEventListener("click", () => onDeleteForumThread(ctx));
  }
  listenersBound = true;
}

function getForumThreadsCache(ctx) {
  const cached = ctx.readObjectCache(
    "cfc-forum-threads-cache-v1",
    1,
    2 * 60 * 1000
  );
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
    .select("id, title, body, user_id, author_display_name, created_at")
    .eq("id", threadId)
    .maybeSingle();
  if (error) {
    return null;
  }
  return data || null;
}

async function refreshForumThreadsFromServer(ctx) {
  const { state } = ctx;
  if (!state.client) {
    return false;
  }
  const { data, error } = await state.client
    .from("forum_threads")
    .select("id, title, body, user_id, author_display_name, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    state.forumStatus = "The Concourse is unavailable right now.";
    return false;
  }
  state.forumThreads = Array.isArray(data) ? data : [];
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
      state.forumThreads = cachedThreads;
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
  const { data, error } = await state.client
    .from("forum_replies")
    .select("id, thread_id, body, user_id, author_display_name, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) {
    state.forumReplies = [];
    return;
  }
  state.forumReplies = Array.isArray(data) ? data : [];
}

async function openForumThreadById(ctx, threadId) {
  ctx.state.activeForumThreadId = threadId;
  ctx.syncRouteHash();
  await loadForumReplies(ctx, threadId);
  ctx.render();
}

function onForumBackToList(ctx) {
  ctx.state.activeForumThreadId = null;
  ctx.state.forumReplies = [];
  ctx.syncRouteHash();
  ctx.render();
}

async function onCreateForumThread(ctx, event) {
  event.preventDefault();
  const { state, els } = ctx;
  if (!state.client || !state.session?.user || (typeof ctx.canWriteActions === "function" && !ctx.canWriteActions())) {
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
        user_id: state.session.user.id,
        author_display_name: ctx.getCurrentUserDisplayName(),
        title,
        body
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
  if (els.forumThreadFormEl) els.forumThreadFormEl.reset();
  await loadForumThreads(ctx, { force: true });
  state.activeForumThreadId = threadId;
  ctx.syncRouteHash();
  await loadForumReplies(ctx, state.activeForumThreadId);
  ctx.render();
}

async function onCreateForumReply(ctx, event) {
  event.preventDefault();
  const { state, els } = ctx;
  if (
    !state.client ||
    !state.session?.user ||
    !state.activeForumThreadId ||
    (typeof ctx.canWriteActions === "function" && !ctx.canWriteActions())
  ) {
    state.forumStatus = "Configuration error. Posting is temporarily unavailable.";
    ctx.render();
    return;
  }
  const body = String(els.forumReplyBodyInputEl?.value || "").trim();
  if (!body) {
    return;
  }
  if (els.forumReplySubmitBtnEl) {
    els.forumReplySubmitBtnEl.disabled = true;
    els.forumReplySubmitBtnEl.textContent = "Posting...";
  }
  let error = null;
  const rpcResult = await state.client.rpc("create_forum_reply", {
    p_thread_id: state.activeForumThreadId,
    p_body: body,
    p_author_display_name: ctx.getCurrentUserDisplayName()
  });
  if (rpcResult.error) {
    const fallback = await state.client.from("forum_replies").insert({
      thread_id: state.activeForumThreadId,
      user_id: state.session.user.id,
      author_display_name: ctx.getCurrentUserDisplayName(),
      body
    });
    error = fallback.error;
  }
  if (els.forumReplySubmitBtnEl) {
    els.forumReplySubmitBtnEl.disabled = false;
    els.forumReplySubmitBtnEl.textContent = "Post Reply";
  }
  if (error) {
    state.forumStatus = error.message;
    ctx.render();
    return;
  }
  state.forumStatus = "Reply posted.";
  if (els.forumReplyFormEl) els.forumReplyFormEl.reset();
  await loadForumReplies(ctx, state.activeForumThreadId);
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

async function onDeleteForumThread(ctx) {
  const { state, els } = ctx;
  const activeThread = state.forumThreads.find((thread) => thread.id === state.activeForumThreadId) || null;
  if (!state.client || !state.session?.user || !activeThread) {
    return;
  }
  const canDelete = ctx.isAdminUser() || activeThread.user_id === state.session.user.id;
  if (!canDelete) {
    return;
  }
  const confirmed = window.confirm("Delete this thread and all replies? This cannot be undone.");
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
  await loadForumThreads(ctx, { force: true });
  ctx.syncRouteHash();
  ctx.render();
}

export function render(ctx) {
  const { state, els } = ctx;
  if (!els.forumThreadListEl || !els.forumStatusEl || !els.forumThreadDetailEl) {
    return;
  }
  const isAuthed = Boolean(state.session?.user);
  const activeThread = state.forumThreads.find((thread) => thread.id === state.activeForumThreadId) || null;
  const isThreadView = Boolean(activeThread);

  if (els.forumAuthGateEl) els.forumAuthGateEl.classList.toggle("hidden", isAuthed);
  if (els.forumThreadFormEl) els.forumThreadFormEl.classList.toggle("hidden", !isAuthed || isThreadView);
  if (els.forumStatusEl) els.forumStatusEl.textContent = state.forumStatus || "";
  els.forumThreadListEl.classList.toggle("hidden", isThreadView);

  els.forumThreadListEl.textContent = "";
  if (state.forumThreads.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No threads yet.";
    els.forumThreadListEl.appendChild(li);
  } else {
    state.forumThreads.forEach((thread) => {
      const li = document.createElement("li");
      const title = document.createElement("p");
      title.className = "no-margin";
      title.style.fontWeight = "800";
      title.textContent = thread.title || "Untitled";
      const meta = document.createElement("p");
      meta.className = "status no-margin";
      meta.textContent = `${thread.author_display_name || "Player"} • ${ctx.formatKickoff(thread.created_at)}`;
      const excerpt = document.createElement("p");
      excerpt.className = "no-margin";
      excerpt.textContent = String(thread.body || "").slice(0, 180);
      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "ghost-btn";
      openBtn.dataset.threadId = thread.id;
      openBtn.textContent = "Open Thread";
      li.appendChild(title);
      li.appendChild(meta);
      li.appendChild(excerpt);
      li.appendChild(openBtn);
      els.forumThreadListEl.appendChild(li);
    });
  }

  els.forumThreadDetailEl.classList.toggle("hidden", !activeThread);
  if (!activeThread) {
    return;
  }
  if (els.forumThreadDetailTitleEl) els.forumThreadDetailTitleEl.textContent = activeThread.title || "Thread";
  if (els.forumThreadDetailMetaEl) {
    els.forumThreadDetailMetaEl.textContent = `${activeThread.author_display_name || "Player"} • ${ctx.formatKickoff(activeThread.created_at)}`;
  }
  if (els.forumThreadDetailBodyEl) {
    els.forumThreadDetailBodyEl.textContent = activeThread.body || "";
  }
  if (els.forumDeleteThreadBtnEl) {
    const canDelete = isAuthed && (ctx.isAdminUser() || activeThread.user_id === state.session?.user?.id);
    els.forumDeleteThreadBtnEl.classList.toggle("hidden", !canDelete);
  }

  if (els.forumReplyListEl) {
    els.forumReplyListEl.textContent = "";
    if (state.forumReplies.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = "No replies yet.";
      els.forumReplyListEl.appendChild(li);
    } else {
      state.forumReplies.forEach((reply) => {
        const li = document.createElement("li");
        const meta = document.createElement("p");
        meta.className = "status no-margin";
        meta.textContent = `${reply.author_display_name || "Player"} • ${ctx.formatKickoff(reply.created_at)}`;
        const body = document.createElement("p");
        body.className = "no-margin";
        body.textContent = reply.body || "";
        li.appendChild(meta);
        li.appendChild(body);
        els.forumReplyListEl.appendChild(li);
      });
    }
  }
  if (els.forumReplyFormEl) els.forumReplyFormEl.classList.toggle("hidden", !isAuthed);
}

export async function onEnter(ctx) {
  bindListeners(ctx);
  await loadForumThreads(ctx, { background: true });
  if (ctx.state.activeForumThreadId) {
    await loadForumReplies(ctx, ctx.state.activeForumThreadId);
  }
  ctx.render();
}
