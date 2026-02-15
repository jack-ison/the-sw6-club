export async function onEnter(ctx) {
  await Promise.allSettled([
    ctx.syncUpcomingFixturesFromChelsea(),
    ctx.maybeRefreshChelseaSquad()
  ]);
  if (ctx.state.session?.user) {
    ctx.ensureAuthedDataLoaded().then(() => {
      ctx.render();
    });
  }
}
