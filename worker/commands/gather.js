exports.run = async (bot, message, interaction, args) => {
  // if (args.length == 0) {
  //   await bot.lib.message.send(
  //     bot,
  //     message,
  //     interaction,
  //     "No argument supplied."
  //   );
  //   return;
  // }

  //console.log("GATHER command issued", args);
  //console.log(!!message, !!interaction, args);
  var author_id = message ? message.author.id : interaction.member.user.id;
  var guild_id = message ? message.guild_id : interaction.guild_id;
  var to_channel, to_channel_arg;

  if (args.length == 0) {
    //Use users own channel as from_channel
    const user_state = await bot.cache.voiceState.find((state) => {
      return state.user_id == author_id && state.guild_id == guild_id;
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
    to_channel_arg = user_state.channel_id;
  } else {
    to_channel_arg = args[0];
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
    return state.channel_id != to_channel.id && state.guild_id == guild_id;
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
    var msg = `Gathered ${count} user${count > 1 ? "s" : ""} to: **${to_channel.name
      }**.`;
  }

  await bot.lib.message.send(bot, message, interaction, msg);
};

exports.help = {
  name: "gather",
  detail: "Gathers all users to one channel !gather [TO_CHANNEL].",
  enabled: true,
  aliases: ["g"],
};
