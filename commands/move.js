exports.run = function (client, message, args, alias) {

  msg = message.content.substring(1).toLowerCase();
  newChannelName = ""

  if (msg.startsWith("move ")) {
    newChannelName = msg.substring(4).trim();
  } else if (msg.startsWith("m ")) {
    newChannelName = msg.substring(1).trim();
  } else {
    newChannelName = msg.trim();
  }

  newChannelId = "";
  for (var key in alias) {
    for (i in alias[key]) {
      if (newChannelName == alias[key][i]) {
        newChannelId = key;
        break;
      }
    }
  }
  if (newChannelId == "") {
    message.channel.send("Cannot handle that command, please try again");
    return
  }

  oldchannel = message.member.voiceChannel

  if(typeof oldchannel === 'undefined') {
    message.channel.send("You are not part of a voicechannel");
    return
  }

  if(oldchannel.id == newChannelId) {
    message.channel.send("You are already in that channel.");
    return
  }

  //Moving users
  counter = 0;
  for (let [snowflake, guildMember] of oldchannel.members) { 
    guildMember.setVoiceChannel(newChannelId)
    .catch(console.error);
    counter++;
  }
  message.channel.send("Moved " + counter + (counter == 1 ? ' user' : ' users') + ' to the channel: "' + message.guild.channels.find("id", newChannelId).name + '"');
};

exports.help = {
  name: "move",
  usage: "!move CHANNELNAME",
  aliases: ["m"]
}
