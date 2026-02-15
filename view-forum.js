export async function onEnter(ctx) {
  await ctx.loadForumThreads({ background: true });
  if (ctx.state.activeForumThreadId) {
    await ctx.loadForumReplies(ctx.state.activeForumThreadId);
  }
  ctx.render();
}
