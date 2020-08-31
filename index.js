const { ShardingManager } = require("discord.js");

//lib setup and config
config = require("./files/config.json");

//For testing
//config = require("./files/config_test.json");

const manager = new ShardingManager("./bot.js", {
  token: config.token,
});

manager.on("shardCreate", (shard) =>
  console.log(`Launched shard: ${shard.id}`)
);
manager.spawn();
