const LocalBucket = require("snowtransfer/dist/ratelimitBuckets/LocalBucket");

module.exports = async (bot, data) => {
  //Recieved ratelimit sync to bucket

  var { routeKey, headers } = JSON.parse(data.content.toString());
  if (!routeKey || !headers) return;
  //console.log("SETTING RATELIMIT SYNC");
  if (!bot.client.requestHandler.ratelimiter.buckets[routeKey]) {
    bot.client.requestHandler.ratelimiter.buckets[routeKey] = new LocalBucket(
      this
    );
  }

  bot.client.requestHandler._applyRatelimitHeaders(
    bot.client.requestHandler.ratelimiter.buckets[routeKey],
    headers
  );
  //console.log(client.requestHandler.ratelimiter.buckets);
};
