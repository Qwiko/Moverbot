("use strict");

const fs = require("fs");
const bot = {};
bot.lib = require("./lib");
const { SnowTransfer } = require("snowtransfer");
const { RainCache, AmqpConnector, RedisStorageEngine } = require("raincache");

bot.client = new SnowTransfer(getEnv("token"));

const con = new AmqpConnector({
  amqpUrl: getEnv("amqp"),
  amqpQueue: "WORKER_INBOUND",
});

bot.cache = new RainCache({
  debug: true,
  storage: {
    default: new RedisStorageEngine({
      redisOptions: {
        host: getEnv("redis"),
      },
    }),
  },
});

bot.lib.sync.send(bot, con);

bot.commands = {};

//Loading commands
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    //bot.lib.debug(`Attempting to load command ${commandName}`);
    if (props) {
      //Load only enabled commands
      bot.commands[commandName] = props;
      //Setting aliases
      props.help.aliases.forEach((alias) => {
        bot.commands[alias] = props;
      });
    }
  });
});

const init = async () => {
  // initialize the cache and the AMQP connector
  await con.initialize();
  await bot.cache.initialize();

  //Worker sync channel, fanout rabbitmq exchange
  const channel = await con.client.createChannel();
  await channel.assertExchange("WORKER_SYNC", "fanout", {
    durable: false,
  });
  const queue = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queue.queue, "WORKER_SYNC", "");
  channel.consume(
    queue.queue,
    (data) => {
      bot.lib.sync.set(bot, data);
    },
    { noAck: true }
  );
  bot.lib.debug("Moverbot Worker Started");
};

// Declare an asynchronous init method

const do_init = () => {
  init()
    .then(() => {
      bot.lib.debug("Connected to Cache and AMQP");
      //bot.lib.debug(con.client);

      con.client.on("close", () => {
        bot.lib.debug("Lost connection to AMQP, reinitializing...");
        //bot.lib.debug("CLOSE", event);
        do_init();
      });
      con.client.on("error", () => {
        bot.lib.debug("Error on connection to AMQP, reinitializing...");
        //bot.lib.debug("CLOSE", event);
        do_init();
      });
    })
    .catch((e) => {
      //bot.lib.debug(e);
      if (e.code == "ENOTFOUND") {
        bot.lib.debug("Cound not connect to hostname: " + e.hostname);
        do_init();
      } else {
        console.error(e);
        process.exit(1);
      }
    });
};
do_init();
//Event triggered from AMQP queue
con.on("event", (event) => {
  if (event.t == "MESSAGE_CREATE" || event.t == "MESSAGE_UPDATE") {
    bot.lib.handlers.message(bot, event.d);
  } else if (event.t == "INTERACTION_CREATE") {
    bot.lib.handlers.interaction(bot, event.d);
  }
});

function getEnv(env) {
  if (typeof process.env[env] == "undefined") {
    console.error(`Enviroment variable '${env}' not found, exiting!`);
    process.exit(1);
  }
  return process.env[env];
}