"use strict";

const { RainCache, AmqpConnector, RedisStorageEngine } = require("raincache");

var defaults = {
  token: "",
  amqp: "localhost",
  redis: "localhost",
};

const con = new AmqpConnector({
  amqpUrl: getEnv("amqp"),
  amqpQueue: "CACHE_INBOUND",
  sendQueue: "WORKER_INBOUND",
});
const cache = new RainCache(
  {
    debug: true,
    storage: {
      default: new RedisStorageEngine({
        redisOptions: {
          host: getEnv("redis"),
        },
      }),
    },
  },
  con,
  con
);

const init = async () => {
  await cache.initialize();
};

const do_init = () => {
  init()
    .then(async () => {
      console.log("Cache ready");
      cache.inbound.client.on("close", () => {
        console.log("Lost connection to AMQP, reinitializing...");
        //console.log("CLOSE", event);
        do_init();
      });
      cache.inbound.client.on("error", () => {
        console.log("Error on connection to AMQP, reinitializing...");
        //console.log("CLOSE", event);
        do_init();
      });
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
};

do_init();

function getEnv(env) {
  if (typeof process.env[env] == "undefined") {
    return defaults[env];
  }
  return process.env[env];
}
