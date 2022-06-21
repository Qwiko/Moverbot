module.exports = async (bot, interaction) => {
  var channel = await bot.cache.channel.find((channel) => {
    return (
      channel.name.toLowerCase() == "moverbot" &&
      channel.type == 0 &&
      channel.guild_id == interaction.guild_id
    );
  });
  if (!channel) return;
  var command = interaction.data.name;
  const cmd = bot.commands[command.toLowerCase()];
  if (cmd) {
    bot.lib.debug({ interaction: interaction })
    cmd.run(
      bot,
      false,
      interaction,
      interaction.data.options.map((e) => e.value)
    );
  } else {
    bot.lib.message.send(bot, false, interaction, "No such command");
  }
};
