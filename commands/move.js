exports.run = function(client, message, args, alias) {
  currentChannel = message.member.voiceChannel;
  newChannelId = "";
  newChannelName = args[0];

  //Check if the user can move members
  if (!message.member.hasPermission("MOVE_MEMBERS")) {
    message.channel.send("You do not have the correct permissions.");
    return;
  }

  //Check if no argument is passed
  if (typeof newChannelName == "undefined") {
    message.channel.send("Please provide a channelname.");
    return;
  }

  //Tried to find the channelID from the name
  for (var key in alias) {
    if (alias[key].includes(newChannelName)) {
      newChannelId = key;
      break;
    }
  }

  //Check if no key is found
  if (newChannelId == "") {
    message.channel.send("There is no such channel: *" + newChannelName + "*.");
    return;
  }

  //Check if the user is part of a voicechannel.
  if (typeof currentChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  //Check if it is the same channel.
  if (currentChannel.id == newChannelId) {
    message.channel.send("You are already in that channel.");
    return;
  }
  newChannel = message.guild.channels.find(val => val.id === newChannelId);
  //Check if the user have permission for the channel.
  if (!newChannel.memberPermissions(message.member).has("CONNECT")) {
    message.channel.send(
      "You do not have permission to move to channel: " + newChannel.name + "."
    );
    return;
  }
  //Moving users
  counter = 0;
  currentChannel.members.forEach(member => {
    member.setVoiceChannel(newChannelId).catch(console.error);
    counter++;
  });
  message.channel.send(
    "Moved " +
      counter +
      (counter == 1 ? " user" : " users") +
      " to the channel: *" +
      newChannel.name +
      "*."
  );
  const tUM = require("../lib/tUM.js");
  tUM(client, counter);
};

exports.help = {
  name: "move",
  detail:
    "Move users from your current channel to another with ${PREFIX}move CHANNELNAME.",
  aliases: ["m"]
};
