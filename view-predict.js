export async function onEnter(ctx) {
  await Promise.allSettled([
    ctx.syncUpcomingFixturesFromChelsea(),
    ctx.maybeRefreshChelseaSquad()
  ]);
}
