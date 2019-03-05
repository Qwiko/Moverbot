exports.run = function(client, message, args, alias) {
  //Drag users from a channel to yours.

  currentChannel = message.member.voiceChannel;
  newChannelId = "";
  newChannelName = args[0];

  if (typeof newChannelName == "undefined") {
    message.channel.send("Please provide a channelname.");
    return;
  }

  for (var key in alias) {
    if (alias[key].includes(newChannelName)) {
      newChannelId = key;
      break;
    }
  }

  newChannel = message.guild.channels.find(val => val.id === newChannelId);

  if (newChannelId == "") {
    message.channel.send("There is no such channel: *" + newChannelName + "*.");
    return;
  }

  if (typeof currentChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  if (currentChannel.id == newChannelId) {
    message.channel.send("You cannot select your own channel.");
    return;
  }

  if (newChannel.members.size == 0) {
    message.channel.send("There is no users in: *" + newChannel.name + "*.");
    return;
  }

  //Moving users
  counter = 0;
  newChannel.members.forEach(member => {
    member.setVoiceChannel(currentChannel.id).catch(console.error);
    counter++;
  });
  message.channel.send(
    "Dragged " +
      counter +
      (counter == 1 ? " user" : " users") +
      " from channel: *" +
      newChannel.name +
      "* to channel: *" +
      currentChannel.name +
      "*."
  );
  const tUM = require("../lib/tUM.js");
  tUM(client, counter);
};

exports.help = {
  name: "drag",
  detail:
    "Drags users from a channel to your channel with: ${PREFIX}drag CHANNELNAME.",
  aliases: ["d"]
};
