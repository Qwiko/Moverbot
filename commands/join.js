exports.run = async (client, message, args) => {
  alias = client.guild.config.alias;

  if (message.webhookID) {
    return client.lib.message.send(client, message.channel, "CANNOT_WEBHOOK");
  }

  oldChannel = message.member.voice.channel;
  var newChannel;

  //Check if no argument is passed
  if (typeof args[0] == "undefined") {
    return client.lib.message.send(
      client,
      message.channel,
      "PROVIDE_CHANNELNAME"
    );
  }

  //Check if the user is part of a voicechannel.
  if (typeof oldChannel === "undefined") {
    return client.lib.message.send(
      client,
      message.channel,
      "NOT_IN_VOICECHANNEL"
    );
  }

  //Tried to find the channelID from the name
  for (var key in alias) {
    if (alias[key].includes(args[0])) {
      //newChannelId = key;
      newChannel = message.guild.channels.cache.find((val) => val.id === key);
      break;
    }
  }

  //Check if no key is found
  if (typeof newChannel === "undefined") {
    return client.lib.message.send(client, message.channel, "NO_SUCH_CHANNEL", {
      newChannelName: args[0],
    });
  }

  //Check if it is the same channel.
  if (oldChannel.id == newChannel.id) {
    return client.lib.message.send(
      client,
      message.channel,
      "ALREADY_IN_CHANNEL"
    );
  }

  //Check bot permissions for the channel
  if (!client.lib.checkPermissions(client, oldChannel)) {
    return client.lib.message.send(
      client,
      message.channel,
      "BOT_NO_PERMISSION",
      { oldChannelName: oldChannel.name }
    );
  }

  //Check if the user have permission for the channel.
  if (!newChannel.memberPermissions(message.member).has("CONNECT")) {
    return client.lib.message.send(
      client,
      message.channel,
      "USER_NO_PERMISSION",
      { newChannelName: newChannel.name }
    );
  }

  var counter = await client.lib.move.channel(
    client,
    message.member,
    newChannel
  );

  if (!counter) {
    message.channel.send(
      "Could not move to " + newChannel.name + ", is it full?"
    );
    return {
      success: false,
      message: "Could not move to " + newChannel.name + ", is it full?",
    };
  }

  return client.lib.message.send(client, message.channel, "JOIN_SUCCESS", {
    user: message.member.displayName,
    newChannelName: newChannel.name,
  });

  // message.channel.send(
  //   message.member.displayName + " moved to channel: *" + newChannel.name + "*."
  // );
  // return {
  //   success: true,
  //   message:
  //     message.member.displayName +
  //     " moved to channel: *" +
  //     newChannel.name +
  //     "*.",
  //   usersmoved: 1,
  // };
};

exports.help = {
  name: "join",
  detail:
    "Moved you from your current channel to another with ${PREFIX}join CHANNELNAME.",
  enabled: true,
  aliases: ["j"],
};
