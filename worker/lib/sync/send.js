module.exports = (bot, con) => {
  //Sync RateLimit between workers
  bot.client.requestHandler.on("done", async (reqId, request) => {
    var routeKey = bot.client.requestHandler.ratelimiter.routify(
      request.coreRes.req.path.slice(
        bot.client.requestHandler.options.baseURL.length
      ),
      request.coreRes.req.method
    );

    const ch = await con.client.createChannel();
    await ch.assertExchange("WORKER_SYNC", "fanout", {
      durable: false,
    });
    var str = JSON.stringify({
      routeKey: routeKey,
      headers: request.headers,
    });
    //console.log(str);
    //console.log("PUBLISHING FANOUT RATELIMIT SYNC");
    await ch.publish("WORKER_SYNC", "", Buffer.from(str));
    ch.close();
  });
};
