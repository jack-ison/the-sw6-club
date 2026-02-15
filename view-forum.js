export async function onEnter(ctx) {
  await ctx.loadForumThreads();
}
