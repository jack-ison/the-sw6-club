export async function onEnter(ctx) {
  await ctx.loadForumThreads();
  if (ctx.state.activeForumThreadId) {
    await ctx.loadForumReplies(ctx.state.activeForumThreadId);
  }
}
