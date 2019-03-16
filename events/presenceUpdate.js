const tUM = require("../lib/tUM.js");
const loadConfig = require("../lib/loadConfig.js");

module.exports = async (client, oldMember, newMember) => {
  //Do not read bot updates.
  if (newMember.user.bot) return;
  //Not in a voiceChannel
  if (newMember.voiceChannelID == null) return;
  //Update does not refer to a game change.
  if (newMember.presence.game == null) return;
  //Does not move while the user changes status.
  if (oldMember.presence.status != newMember.presence.status) return;
  //Only move if the user is online.
  if (newMember.presence.status != "online") return;

  //Load config
  data = {};
  data.guild = newMember.guild;
  loadConfig(data, client.dbGuild, function(config) {
    users = config.users;
    if (typeof config.users == "undefined") {
      //No data means no users have activated presencemoving.
      return;
    }
    if (users[newMember.id] == null || users[newMember.id].enabled == false) {
      //If we can't find information about the user in the database skip, or if they have opted out.
      return;
    }

    gamename = newMember.presence.game.name;
    newChannelId = "";

    for (var key in config.alias) {
      if (config.alias[key].includes(gamename)) {
        newChannelId = key;
        break;
      }
    }
    if (newChannelId == "") {
      //No channel found.
      return;
    }
    if (newMember.voiceChannelID == newChannelId) {
      //Already in right channel
      return;
    }
    counter = 0;
    if (users[newMember.id].drag) {
      //Move all users
      newMember.voiceChannel.members.forEach(member => {
        member.setVoiceChannel(newChannelId).catch(console.error);
        counter++;
      });
    } else {
      //Move one user.
      newMember.setVoiceChannel(newChannelId);
      counter = 1;
    }
    tUM(client, counter);
  });
};
