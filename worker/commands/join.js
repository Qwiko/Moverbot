exports.run = async (bot, message, interaction, args) => {
  if (args.length == 0) {
    await bot.lib.message.send(
      bot,
      message,
      interaction,
      "No argument supplied."
    );
    return;
  }

  var mentions = message ? message.mentions : interaction.data.options; //?

  console.log("JOIN command issued", args);
  //console.log(!!message, !!interaction, args);
  var author_id = message ? message.author.id : interaction.member.user.id;
  var guild_id = message ? message.guild_id : interaction.guild_id;
  var from_user_id, to_channel, to_channel_arg;

  if (args.length == 1) {
    //Use users own channel as from_channel
    from_user_id = author_id;
    to_channel_arg = args[0];
  } else {
    if (mentions.length == 0) {
      await bot.lib.message.send(
        bot,
        message,
        interaction,
        "Incorrect arguments."
      );
      return;
    }
    from_user_id = message ? mentions[0].id : args[0];
    to_channel_arg = args[1];
  }

  //Fromstate
  const user_state = await bot.cache.voiceState.find((state) => {
    return state.user_id == from_user_id && state.guild_id == guild_id;
  });
  if (!user_state) {
    await bot.lib.message.send(
      bot,
      message,
      interaction,
      "User not connected to voice."
    );
    return;
  }

  to_channel = await bot.cache.channel.find((channel) => {
    return (
      (channel.id == to_channel_arg || channel.name == to_channel_arg) &&
      channel.type == 2 &&
      channel.guild_id == guild_id
    );
  });

  if (!to_channel) {
    await bot.lib.message.send(
      bot,
      message,
      interaction,
      "To channel is not valid."
    );
    return;
  }

  if (user_state.channel_id == to_channel.id) {
    await bot.lib.message.send(
      bot,
      message,
      interaction,
      "Already in correct channel."
    );
    return;
  }

  await bot.client.guild.updateGuildMember(guild_id, user_state.user_id, {
    channel_id: to_channel.id,
  });

  var msg = `Moved user to: **${to_channel.name}**.`;

  await bot.lib.message.send(bot, message, interaction, msg);
};

exports.help = {
  name: "join",
  detail: "Moves you or one user to another with !join [@Mention] TO_CHANNEL.",
  enabled: true,
  aliases: ["j"],
};
