const tools = require("../lib/tools.js");

exports.run = function (client, message, args) {
  alias = client.guild.config.alias;
  newChannel = "";

  //Gathers all users to your voicechannel.
  if (args.length > 0) {
    //Try and find the channelID from the arg
    for (var key in alias) {
      if (alias[key].includes(args[0])) {
        newChannel = message.guild.channels.cache.find((val) => val.id === key);
        break;
        //&& val.type == "voice"
      }
    }
  } else {
    newChannel = message.member.voice.channel;
  }
  if (!message.webhookID) {
    //Todo fix for webhooks
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send(
        "You need to be an administrator to use this command."
      );
      return;
    }
  }
  //You need to be a part of a channel.
  if (typeof newChannel === "undefined") {
    message.channel.send(
      "You are not part of a voicechannel or supplied a valid destination."
    );
    return;
  }

  //Find all voicechannels without the one we are in.
  allVoice = message.guild.channels.cache.filter((val) => {
    //message.channel
    return (
      val.type == "voice" &&
      val.id != newChannel.id &&
      tools.checkPermissions(client, val)
    );
  });

  //Check if there are any members that can be moved. If the guild are empty exept for you.
  guildActive = 0;
  allVoice.each((channel) => {
    guildActive += channel.members.size;
  });
  if (guildActive == 0) {
    message.channel.send("There are no users that can be moved.");
    return;
  }

  counter = 0;
  allVoice.each((channel) => {
    //Only move the channels with members inside.
    if (channel.members.size != 0) {
      value = tools.moveMembers(client, channel, newChannel);
      if (value) {
        counter += value;
      }
    }
  });

  if (!counter) {
    message.channel.send("Something went wrong, could not move anyone.");
    return;
  }

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
    "Gathers all users from all channels to your channel with: ${PREFIX}gather. Optional you can send with ${PREFIX}gather CHANNELNAME",
  enabled: true,
  aliases: [],
};
