module.exports = async (bot, message) => {
  //Allow webhooks but not bots
  if (message.author.bot && !message.webhook_id) return;

  //Ignores all messages without the prefix
  if (!message.content.startsWith("!")) return;

  var channel = await bot.cache.channel.find((channel) => {
    return (
      channel.name.toLowerCase() == "moverbot" &&
      channel.type == 0 &&
      channel.guild_id == message.guild_id
    );
  });
  if (!channel) return;

  if (message.channel_id) var args = message.content.slice(1).trim().split(" ");
  var command = args.shift();

  const cmd = bot.commands[command.toLowerCase()];
  if (cmd) {
    bot.lib.debug({ ...message, args: args })
    cmd.run(bot, message, false, args);
  } else {
    bot.lib.message.send(bot, message, false, "No such command");
  }
};
