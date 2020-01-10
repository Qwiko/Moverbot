const tools = require("../lib/tools.js");

exports.run = function(client, message, args, alias) {
  oldChannel = message.member.voiceChannel;
  var newChannel;

  //Check if no argument is passed
  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide a channelname.");
    return;
  }

  //Check if the user is part of a voicechannel.
  if (typeof oldChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  //Tried to find the channelID from the name
  for (var key in alias) {
    if (alias[key].includes(args[0])) {
      //newChannelId = key;
      newChannel = message.guild.channels.find(val => val.id === key);
      break;
    }
  }

  //Check if no key is found
  if (typeof newChannel === "undefined") {
    message.channel.send("There is no such channel: *" + args[0] + "*.");
    return;
  }

  //Check if it is the same channel.
  if (oldChannel.id == newChannel.id) {
    message.channel.send("You are already in that channel.");
    return;
  }

  //Check if the user have permission for the channel.
  if (!newChannel.memberPermissions(message.member).has("CONNECT")) {
    message.channel.send(
      "You do not have permission to move to channel: " + newChannel.name + "."
    );
    return;
  }

  counter = tools.moveMembers(client, message.member, newChannel);

  if (!counter) {
    message.channel.send(
      "Could not move to " + newChannel.name + ", is it full?"
    );
    return;
  }

  message.channel.send(
    message.member.displayName + " moved to channel: *" + newChannel.name + "*."
  );
};

exports.help = {
  name: "join",
  detail:
    "Moved you from your current channel to another with ${PREFIX}join CHANNELNAME.",
  aliases: ["j"]
};
