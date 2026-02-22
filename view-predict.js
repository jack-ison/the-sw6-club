export async function onEnter(ctx) {
  Promise.allSettled([
    ctx.syncUpcomingFixturesFromChelsea(),
    ctx.maybeRefreshChelseaSquad()
  ]).then(() => {
    ctx.render();
  });
  if (ctx.state.session?.user) {
    ctx.ensureAuthedDataLoaded().then(() => {
      ctx.render();
    });
  }
}
