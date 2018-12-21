exports.run = function (client, message, args, alias) {

  currentChannel = message.member.voiceChannel;
  newChannelId = "";
  newChannelName = args[0];

  //
  for (var key in alias) {
    if (alias[key].includes(newChannelName)) {
      newChannelId = key;
      break;
    }
  }
  
  if (newChannelId == "") {
    message.channel.send("There is no such channel: *" + newChannelName + "*.");
    return;
  }
    
  if(typeof currentChannel === 'undefined') {
    message.channel.send("You are not part of a voicechannel.");
    return;
  }

  if(currentChannel.id == newChannelId) {
    message.channel.send("You are already in that channel.");
    return;
  }

  //Moving users
  counter = 0;
  currentChannel.members.forEach(member => {
    member.setVoiceChannel(newChannelId)
      .catch(console.error);
    counter++;
  })
  message.channel.send("Moved " + counter + (counter == 1 ? ' user' : ' users') + ' to the channel: *' + message.guild.channels.find(val => val.id === key).name + '*.');
};

exports.help = {
  name: "move",
  usage: "!move CHANNELNAME",
  aliases: ["m"]
}
