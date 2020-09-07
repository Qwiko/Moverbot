exports.run = function (client, message, args) {
  alias = client.guild.config.alias;

  if (message.webhookID) {
    message.channel.send("Webhooks cannot be used with that command.");
    return {
      success: false,
      message: "Webhooks cannot be used with that command.",
    };
  }

  oldChannel = message.member.voice.channel;
  var newChannel;

  //Check if no argument is passed
  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide a channelname.");
    return {
      success: false,
      message: "Please provide a channelname.",
    };
  }

  //Check if the user is part of a voicechannel.
  if (typeof oldChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return {
      success: false,
      message: "You are not part of a voicechannel.",
    };
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
    message.channel.send("There is no such channel: *" + args[0] + "*.");
    return {
      success: false,
      message: "There is no such channel: *" + args[0] + "*.",
    };
  }

  //Check if it is the same channel.
  if (oldChannel.id == newChannel.id) {
    message.channel.send("You are already in that channel.");
    return {
      success: false,
      message: "You are already in that channel.",
    };
  }

  //Check bot permissions for the channel
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

  //Check if the user have permission for the channel.
  if (!newChannel.memberPermissions(message.member).has("CONNECT")) {
    message.channel.send(
      "You do not have permission to move to channel: " + newChannel.name + "."
    );
    return {
      success: false,
      message:
        "You do not have permission to move to channel: " +
        newChannel.name +
        ".",
    };
  }

  counter = client.lib.moveMembers(client, message.member, newChannel);

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
    message.member.displayName + " moved to channel: *" + newChannel.name + "*."
  );
  return {
    success: true,
    message:
      message.member.displayName +
      " moved to channel: *" +
      newChannel.name +
      "*.",
    usersmoved: 1,
  };
};

exports.help = {
  name: "join",
  detail:
    "Moved you from your current channel to another with ${PREFIX}join CHANNELNAME.",
  enabled: true,
  aliases: ["j"],
};
