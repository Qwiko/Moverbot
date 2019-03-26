const moveMembers = require("../lib/moveMembers.js");

exports.run = function(client, message, args, alias) {
  //Gathers all users to your voicechannel.
  newChannel = message.member.voiceChannel;

  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send(
      "You need to be an administrator to use this command."
    );
    return;
  }
  //You need to be a part of a channel.
  if (typeof newChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  //Find all voicechannels without the one we are in.
  allVoice = message.guild.channels.filter(
    val => val.type == "voice" && val.id != newChannel.id
  );
  //Check if there are any members that can be moved. If the guild are empty exept for you.
  guildActive = 0;
  allVoice.forEach(channel => {
    guildActive += channel.members.size;
  });
  if (guildActive == 0) {
    message.channel.send("There are no users that can be moved.");
    return;
  }

  counter = 0;
  allVoice.forEach(channel => {
    //Only move the channels with members inside.
    if (channel.members.size != 0) {
      counter += moveMembers(client, channel, newChannel);
    }
  });
  message.channel.send(
    "Gathered " +
      counter +
      (counter == 1 ? " user" : " users") +
      " to channel: *" +
      newChannel.name +
      "*."
  );
};

exports.help = {
  name: "gather",
  detail:
    "Gathers all users from all channels to your channel with: ${PREFIX}gather.",
  aliases: []
};
