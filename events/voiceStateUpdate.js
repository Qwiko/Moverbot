const tools = require("../lib/tools.js");

module.exports = async (client, oldMember, newMember) => {
  //Created for Yogcast_Cyan and idle AFK-channel.
  //Disconnected
  if (newMember.voiceChannelID == null) return;

  if (newMember.voiceChannel != newMember.guild.afkChannel) {
    return;
  }
  //Load config
  tools.loadConfig(client, newMember.guild, function (config) {
    newChannelId = "";

    for (var key in config.alias) {
      if (config.alias[key].includes("AFKIDLECHANNEL")) {
        newChannelId = key;
        break;
      }
    }
    if (newChannelId == "") {
      //No channel found.
      return;
    }

    newMember.setVoiceChannel(newChannelId);

    tools.log(
      client,
      newMember.user.username,
      newMember.id,
      newMember.guild.id,
      "AFK-moved to: '" +
        newMember.guild.channels.cache.find((val) => val.id === newChannelId)
          .name +
        "':" +
        newChannelId
    );
    tools.totalUsersMoved(client, 1);
  });
};
