const tools = require("../lib/tools.js");

exports.run = function (client, message, args, alias) {
  //Gathers all users to your voicechannel.
  if (args) {
    //Try and find the channelID from the arg
    for (var key in alias) {
      if (alias[key].includes(args[0])) {
        newChannel = message.guild.channels.find((val) => val.id === key);
        break;
      }
    }
  } else {
    newChannel = message.member.voiceChannel;
  }
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
  allVoice = message.guild.channels.filter((val) => {
    //message.channel
    return (
      val.type == "voice" &&
      val.id != newChannel.id &&
      message.guild.members
        .get(client.user.id)
        .permissionsIn(val)
        .has("MOVE_MEMBERS")
    );
  });
  //Check if there are any members that can be moved. If the guild are empty exept for you.
  guildActive = 0;
  allVoice.forEach((channel) => {
    guildActive += channel.members.size;
  });
  if (guildActive == 0) {
    message.channel.send("There are no users that can be moved.");
    return;
  }

  counter = 0;
  allVoice.forEach((channel) => {
    //Only move the channels with members inside.
    if (channel.members.size != 0) {
      counter += tools.moveMembers(client, channel, newChannel);
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
  aliases: [],
};
