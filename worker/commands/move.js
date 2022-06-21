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

  console.log("MOVE command issued", args);
  //console.log(!!message, !!interaction, args);
  var author_id = message ? message.author.id : interaction.member.user.id;
  var guild_id = message ? message.guild_id : interaction.guild_id;
  var from_channel, to_channel, from_channel_arg, to_channel_arg;
  if (args.length == 1) {
    //Use users own channel as from_channel
    const user_state = await bot.cache.voiceState.find((state) => {
      return state.user_id == author_id;
    });
    if (!user_state) {
      await bot.lib.message.send(
        bot,
        message,
        interaction,
        "Not connected to voice."
      );
      return;
    }
    from_channel_arg = user_state.channel_id;
    to_channel_arg = args[0];
  } else {
    from_channel_arg = args[0];
    to_channel_arg = args[1];
  }

  from_channel = await bot.cache.channel.find((channel) => {
    return (
      (channel.id == from_channel_arg || channel.name == from_channel_arg) &&
      channel.type == 2 &&
      channel.guild_id == guild_id
    );
  });

  if (!from_channel) {
    await bot.lib.message.send(
      bot,
      message,
      interaction,
      "From channel is not valid"
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

  const voicestates = await bot.cache.voiceState.filter((state) => {
    return (
      state.channel_id == from_channel.id &&
      state.guild_id == guild_id &&
      state.channel_id != to_channel.id
    );
  });

  if (voicestates.length == 0) {
    await bot.lib.message.send(bot, message, interaction, "No users to move.");
    return;
  }

  var updatePromises = [];

  for (var state of voicestates) {
    var updatePromise = bot.client.guild.updateGuildMember(
      guild_id,
      state.user_id,
      {
        channel_id: to_channel.id,
      }
    );
    updatePromises.push(updatePromise);
  }
  await Promise.allSettled(updatePromises);
  var count = updatePromises.length;
  if (count == 0) {
    var msg = "Could not move any users.";
  } else {
    var msg = `Moved ${count} user${count > 1 ? "s" : ""} from: **${
      from_channel.name
    }** to: **${to_channel.name}**.`;
  }

  await bot.lib.message.send(bot, message, interaction, msg);
};

exports.help = {
  name: "move",
  detail:
    "Move users from your current channel to another with !move [FROM_CHANNEL] TO_CHANNEL.",
  enabled: true,
  aliases: ["m"],
};
