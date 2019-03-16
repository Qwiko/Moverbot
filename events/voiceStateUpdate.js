const tUM = require("../lib/tUM.js");
const loadConfig = require("../lib/loadConfig.js");

module.exports = async (client, oldMember, newMember) => {
  //Disconnected
  if (newMember.voiceChannelID == null) return;

  if (newMember.voiceChannel != newMember.guild.afkChannel) {
    return;
  }
  //Load config
  data = {};
  data.guild = newMember.guild;
  loadConfig(data, client.dbGuild, function(config) {
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
    tUM(client, 1);
  });
};

//presenceUpdate
/*if (newMember.presence.status == "idle") {
    //Load config
    data = {};
    data.guild = newMember.guild;
    loadConfig(data, client.dbGuild, function(config) {
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
      tUM(client, 1);
    });
  }*/
