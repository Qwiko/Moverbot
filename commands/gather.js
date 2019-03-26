exports.run = function(client, message, args, alias) {
  //Gathers all users to your voicechannel.

  currentChannel = message.member.voiceChannel;

  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send(
      "You need to be an administrator to use this command."
    );
    return;
  }

  if (typeof currentChannel === "undefined") {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  counter = 0;
  allVoice = message.guild.channels.filter(
    val => val.type == "voice" && val.id != currentChannel.id
  );
  guildActive = 0;
  allVoice.forEach(channel => {
    guildActive += channel.members.size;
  });

  if (guildActive == 0) {
    message.channel.send("There are no users that can be moved.");
    return;
  }

  allVoice.forEach(channel => {
    if (channel.members.size != 0) {
      channel.members.forEach(member => {
        member.setVoiceChannel(currentChannel.id).catch(console.error);
        counter++;
      });
    }
  });
  message.channel.send(
    "Gathered " +
      counter +
      (counter == 1 ? " user" : " users") +
      " to channel: *" +
      currentChannel.name +
      "*."
  );
  const tUM = require("../lib/tUM.js");
  tUM(client, counter);
};

exports.help = {
  name: "gather",
  detail:
    "Gathers all users from all channels to your channel with: ${PREFIX}gather.",
  aliases: []
};
