exports.run = function(client, message, args, alias) {
  currentChannel = message.member.voiceChannel;
  newChannelId = "";
  newChannelName = args[0];

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
      message.guild.channels.find(val => val.id === newChannelId).name +
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
