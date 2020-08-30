const tools = require("../lib/tools.js");

exports.run = function (client, message, args, alias) {
  //Drag users from a channel to yours.

  if (message.webhookID) {
    message.channel.send("Webhooks cannot be used with that command.");
    return;
  }

  newChannel = message.member.voiceChannel;
  oldChannelId = "";
  oldChannelName = args[0];

  //Check if the user can move members
  if (!message.member.hasPermission("MOVE_MEMBERS")) {
    message.channel.send("You do not have the correct permissions.");
    return;
  }

  if (typeof oldChannelName == "undefined") {
    message.channel.send("Please provide a channelname.");
    return;
  }

  //Search the alias for the argument
  for (var key in alias) {
    if (alias[key].includes(oldChannelName)) {
      oldChannelId = key;
      break;
    }
  }

  if (oldChannelId == "") {
    message.channel.send("There is no such channel: *" + oldChannelName + "*.");
    return;
  }

  if (typeof newChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  if (newChannel.id == oldChannelId) {
    message.channel.send("You cannot select your own channel.");
    return;
  }

  oldChannel = message.guild.channels.find((val) => val.id === oldChannelId);

  if (oldChannel.members.size == 0) {
    message.channel.send("There is no users in: *" + oldChannel.name + "*.");
    return;
  }

  //Moving users
  var counter = tools.moveMembers(client, oldChannel, newChannel);

  if (!counter) {
    message.channel.send(
      "Could not move to " + newChannel.name + ", is it full?"
    );
    return;
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
};

exports.help = {
  name: "drag",
  detail:
    "Drags users from a channel to your channel with: ${PREFIX}drag CHANNELNAME.",
  enabled: true,
  aliases: ["d"],
};
