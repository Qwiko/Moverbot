exports.run = async (client, message, args) => {
  alias = client.guild.config.alias;

  var oldChannel;
  var newChannel;

  //Check if the user can move members
  if (!message.webhookID) {
    if (!message.member.hasPermission("MOVE_MEMBERS")) {
      return client.lib.message.send(
        client,
        message.channel,
        "PERMISSION_MOVE_MEMBERS"
      );
    }
  }
  //Check if no argument is passed
  if (typeof args[0] == "undefined") {
    return client.lib.message.send(
      client,
      message.channel,
      "PROVIDE_CHANNELNAME"
    );
  }

  if (message.webhookID && args.length < 2) {
    return client.lib.message.send(client, message.channel, "WEBHOOK_MOVE", {
      prefix: client.guild.config.prefix,
    });
  }

  //Trying to find the channelID from the name
  if (args.length >= 2) {
    //Directional move
    for (var key in alias) {
      if (alias[key].includes(args[0])) {
        //newChannelId = key;
        oldChannel = message.guild.channels.cache.find((val) => val.id === key);
      }
      if (alias[key].includes(args[1])) {
        //newChannelId = key;
        newChannel = message.guild.channels.cache.find((val) => val.id === key);
      }
    }
  } else {
    oldChannel = message.member.voice.channel;
    //Standard move
    for (var key in alias) {
      if (alias[key].includes(args[0])) {
        //newChannelId = key;
        newChannel = message.guild.channels.cache.find((val) => val.id === key);
        break;
      }
    }
  }
  //Check if the user is part of a voicechannel.
  if (oldChannel == null && args.length == 1) {
    return client.lib.message.send(
      client,
      message.channel,
      "NOT_IN_VOICECHANNEL"
    );
  }

  //Check if no key is found
  if (typeof oldChannel === "undefined") {
    return client.lib.message.send(client, message.channel, "NO_SUCH_CHANNEL", {
      newChannelName: args[0],
    });
  }

  //Check if no key is found
  if (typeof newChannel === "undefined") {
    return client.lib.message.send(client, message.channel, "NO_SUCH_CHANNEL", {
      newChannelName: args[args.length >= 2 ? 1 : 0],
    });
  }

  //Check if it is the same channel.
  if (oldChannel.id == newChannel.id) {
    if (args.length == 1) {
      return client.lib.message.send(
        client,
        message.channel,
        "ALREADY_IN_CHANNEL"
      );
    } else {
      return client.lib.message.send(client, message.channel, "SAME_CHANNEL");
    }
  }

  //Check if the user have permission for the channel.
  if (
    message.webhookID
      ? false
      : !newChannel.memberPermissions(message.member).has("CONNECT") //Ugly fix
  ) {
    return client.lib.message.send(
      client,
      message.channel,
      "USER_NO_PERMISSION",
      { newChannelName: newChannel.name }
    );
  }

  //Cannot move from that channel
  if (!client.lib.checkPermissions(client, oldChannel)) {
    return client.lib.message.send(
      client,
      message.channel,
      "BOT_NO_PERMISSION",
      { oldChannelName: oldChannel.name }
    );
  }

  //var counter = client.lib.moveMembers(client, oldChannel, newChannel);

  var counter = await client.lib.move.channel(client, oldChannel, newChannel);

  if (!counter) {
    return client.lib.message.send(client, message.channel, "COULD_NOT_MOVE", {
      newChannelName: newChannel.name,
    });
  }

  return client.lib.message.send(client, message.channel, "MOVE_SUCCESS", {
    counter: counter,
    newChannelName: newChannel.name,
  });
};

exports.help = {
  name: "move",
  detail:
    "Move users from your current channel to another with ${PREFIX}move CHANNELNAME.",
  enabled: true,
  aliases: ["m"],
};
