exports.run = function (client, message, args) {
  //Drag users from a channel to yours.
  alias = client.guild.config.alias;
  if (message.webhookID) {
    message.channel.send("Webhooks cannot be used with that command.");
    return {
      success: false,
      message: "Webhooks cannot be used with that command.",
    };
  }

  newChannel = message.member.voice.channel;
  oldChannelId = "";
  oldChannelName = args[0];

  //Check if the user can move members
  if (!message.member.hasPermission("MOVE_MEMBERS")) {
    message.channel.send("You do not have the correct permissions.");
    return {
      success: false,
      message: "You do not have the correct permissions.",
    };
  }

  if (typeof oldChannelName == "undefined") {
    message.channel.send("Please provide a channelname.");
    return {
      success: false,
      message: "Please provide a channelname.",
    };
  }

  //Search the alias for the argument
  for (var key in alias) {
    if (alias[key].includes(oldChannelName)) {
      oldChannelId = key;
      break;
    }
  }

  oldChannel = message.guild.channels.cache.find(
    (val) => val.id === oldChannelId
  );

  if (typeof oldChannel == "undefined") {
    message.channel.send("There is no such channel: *" + oldChannelName + "*.");
    return {
      success: false,
      message: "There is no such channel: *" + oldChannelName + "*.",
    };
  }

  if (typeof newChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return {
      success: false,
      message: "You are not part of a voicechannel.",
    };
  }

  if (newChannel.id == oldChannel.id) {
    message.channel.send("You cannot select your own channel.");
    return {
      success: false,
      message: "You cannot select your own channel.",
    };
  }

  if (!client.lib.checkPermissions(client, oldChannel)) {
    message.channel.send(
      "Cannot move from " +
        oldChannel.name +
        ", I do not have permissions for that."
    );
    return {
      success: false,
      message:
        "Cannot move from " +
        oldChannel.name +
        ", I do not have permissions for that.",
    };
  }

  if (oldChannel.members.size == 0) {
    message.channel.send("There is no users in: *" + oldChannel.name + "*.");
    return {
      success: false,
      message: "There is no users in: *" + oldChannel.name + "*.",
    };
  }

  //Moving users
  var counter = client.lib.moveMembers(client, oldChannel, newChannel);

  if (!counter) {
    message.channel.send(
      "Could not move to " + newChannel.name + ", is it full?"
    );
    return {
      success: false,
      message: "Could not move to " + newChannel.name + ", is it full?",
    };
  }

  message.channel.send(
    "Dragged " +
      counter +
      (counter == 1 ? " user" : " users") +
      " from channel: *" +
      oldChannel.name +
      "* to channel: *" +
      newChannel.name +
      "*."
  );
  return {
    success: true,
    message:
      "Dragged " +
      counter +
      (counter == 1 ? " user" : " users") +
      " from channel: *" +
      oldChannel.name +
      "* to channel: *" +
      newChannel.name +
      "*.",
    usersmoved: counter,
  };
};

exports.help = {
  name: "drag",
  detail:
    "Drags users from a channel to your channel with: ${PREFIX}drag CHANNELNAME.",
  enabled: true,
  aliases: ["d"],
};
