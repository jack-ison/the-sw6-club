export async function onEnter(ctx) {
  await ctx.ensureOverallLeaderboardLoaded();
  if (ctx.isAdminUser()) {
    await ctx.loadAdminLeagues();
  }
}
