const tools = require("../lib/tools.js");

exports.run = function (client, message, args, alias) {
  var oldChannel;
  var newChannel;

  //Check if the user can move members
  if (!message.member.hasPermission("MOVE_MEMBERS")) {
    message.channel.send("You do not have the correct permissions.");
    return;
  }

  //Check if no argument is passed
  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide a channelname.");
    return;
  }

  //Trying to find the channelID from the name
  if (args.length >= 2) {
    //Directional move
    for (var key in alias) {
      if (alias[key].includes(args[0])) {
        //newChannelId = key;
        oldChannel = message.guild.channels.find((val) => val.id === key);
      }
      if (alias[key].includes(args[1])) {
        //newChannelId = key;
        newChannel = message.guild.channels.find((val) => val.id === key);
      }
    }
  } else {
    oldChannel = message.member.voiceChannel;
    //Standard move
    for (var key in alias) {
      if (alias[key].includes(args[0])) {
        //newChannelId = key;
        newChannel = message.guild.channels.find((val) => val.id === key);
        break;
      }
    }
  }
  //Check if the user is part of a voicechannel.
  if (typeof oldChannel === "undefined" && args.length == 1) {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  //Check if no key is found
  if (typeof oldChannel === "undefined") {
    message.channel.send("There is no such channel: *" + args[0] + "*.");
    return;
  }

  //Check if no key is found
  if (typeof newChannel === "undefined") {
    message.channel.send(
      "There is no such channel: *" + args[args.length >= 2 ? 1 : 0] + "*."
    );
    return;
  }

  //Check if it is the same channel.
  if (oldChannel.id == newChannel.id) {
    if (args.length == 1) {
      message.channel.send("You are already in that channel.");
    } else {
      message.channel.send("Cannot move to the same channel");
    }
    return;
  }

  //Check if the user have permission for the channel.
  if (!newChannel.memberPermissions(message.member).has("CONNECT")) {
    message.channel.send(
      "You do not have permission to move to channel: " + newChannel.name + "."
    );
    return;
  }

  //Cannot move from that channel
  if (!tools.checkPermissions(client, oldChannel)) {
    message.channel.send(
      "Cannot move from " +
        oldChannel.name +
        ", I do not have permissions for that."
    );
    return;
  }

  var counter = tools.moveMembers(client, oldChannel, newChannel);

  if (!counter) {
    message.channel.send(
      "Could not move to " + newChannel.name + ", is it full?"
    );
    return;
  }

  message.channel.send(
    "Moved " +
      counter +
      (counter == 1 ? " user" : " users") +
      " to the channel: *" +
      newChannel.name +
      "*."
  );
};

exports.help = {
  name: "move",
  detail:
    "Move users from your current channel to another with ${PREFIX}move CHANNELNAME.",
  aliases: ["m"],
};
