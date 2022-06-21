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

  //console.log("SPLIT command issued", args);
  //console.log(!!message, !!interaction, args);
  var author_id = message ? message.author.id : interaction.member.user.id;
  var guild_id = message ? message.guild_id : interaction.guild_id;
  var to_channel, to_channel_arg;

  if (args.length == 1) {
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

  to_channel_group = await bot.cache.channel.find((channel) => {
    return (
      (channel.id == to_channel_arg || channel.name == to_channel_arg) &&
      channel.type == 4 &&
      channel.guild_id == guild_id
    );
  });

  if (!to_channel_group) {
    //Category not found
    await bot.lib.message.send(
      bot,
      message,
      interaction,
      "No channel group found."
    );
    return;
  }
  to_channels = await bot.cache.channel.filter((channel) => {
    return (
      channel.parent_id == to_channel_group.id &&
      channel.type == 2 &&
      channel.guild_id == guild_id
    );
  });

  if (to_channels.length == 0) {
    await bot.lib.message.send(
      bot,
      message,
      interaction,
      "No To channels found."
    );
    return;
  }

  //Sort channels depending on position.
  to_channels = to_channels.sort((e1, e2) => {
    if (e1.position < e2.position) return -1;
    if (e1.position > e2.position) return 1;
  });

  const voicestates = await bot.cache.voiceState.filter((state) => {
    return (
      state.channel_id == from_channel.id &&
      //!to_channels.map((ch) => ch.id).includes(state.channel_id) &&
      state.guild_id == guild_id
    );
  });
  if (voicestates.length == 0) {
    await bot.lib.message.send(bot, message, interaction, "No users to move.");
    return;
  }

  var updatePromises = [];

  var splitAmount = voicestates.length / to_channels.length;

  for (var i in to_channels) {
    var chan = to_channels[i];
    var start = updatePromises.length;
    var end = Math.round(start + splitAmount);
    if (end > voicestates.length) end = voicestates.length;

    if (start == end) break;
    console.log("CHAN:", i, "START END:", start, end);
    for (var state of voicestates.slice(start, end)) {
      console.log("MOVING:", state.user_id);
      //Already in correct channel, promise reject
      if (state.channel_id == chan.id) {
        updatePromises.push(Promise.reject(state.user_id));
        continue;
      }
      var updatePromise = bot.client.guild.updateGuildMember(
        guild_id,
        state.user_id,
        {
          channel_id: chan.id,
        }
      );
      updatePromises.push(updatePromise);
    }
  }

  updatePromises = await (
    await Promise.allSettled(updatePromises)
  ).filter((pro) => pro.status == "fulfilled");

  var count = updatePromises.length;
  if (count == 0) {
    var msg = "Could not move any users.";
  } else {
    var msg = `Split ${count} user${count > 1 ? "s" : ""} to: **${to_channel_group.name
      }**.`;
  }

  await bot.lib.message.send(bot, message, interaction, msg);
};

exports.help = {
  name: "split",
  detail:
    "Splits users to many channels !split [FROM_CHANNEL] [TO_CHANNELGROUP| .CHANNEL1 .CHANNEL2].",
  enabled: true,
  aliases: ["s"],
};
