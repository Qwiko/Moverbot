module.exports = function (message, dict, channels) {

  //Splits the message again.
  msg = message.content.split(" ")
  channelname = ""

  //Removes m or move prefix for the move command 
  if (msg[0] == "m" || msg[0] == "move") {
    msg.shift();
  }
  //Adds together channelnames with space in between
  for (i in msg) {
    channelname += msg[i];
  }
  console.log(channelname)

  if (channels.includes(channelname)) {
    var values = Object.values(dict)
    var keys = Object.keys(dict);
    for (i in values) {
      if (values[i].includes(channelname) || keys[i].toLowerCase() == channelname) {

        newchannel = message.guild.channels.find("name", keys[i])
        oldchannel = message.member.voiceChannel


        if (newchannel != null && newchannel.type == "voice") {
          if (oldchannel == newchannel) {
            message.channel.send("You are already in that channel.");
          } else {
      
            if(typeof oldchannel !== 'undefined' && typeof oldchannel.members !== 'undefined') {

            }
          }
        } else {
          message.channel.send("No such voicechannel");
        }
        break;
      }
    }
  } else {
    message.channel.send("No such voicechannel");
  }

  /*
  newchannel = message.guild.channels.find("name", channelname)
  if (newchannel != null && newchannel.type == "voice") {
    oldchannel = message.member.voiceChannel
    if (oldchannel == newchannel) {
      message.channel.send("You are already in that channel.");
    } else {

      if(typeof oldchannel !== 'undefined' && typeof oldchannel.members !== 'undefined') {

        //console.log(oldchannel);
        //console.log(newchannel);

        var i = 0
        for (let [snowflake, guildMember] of oldchannel.members) {
          guildMember.setVoiceChannel(newchannel.id)
          .catch(console.error);
          i++
        }
        message.channel.send("Moved " + i + (i == 1 ? ' user' : ' users') + ' to the channel: "' + newchannel.name + '"');
      } else {
        message.channel.send("You are not part of a voicechannel");
      }
    }
  } else {
    message.channel.send("No such voicechannel");
  }*/
};
