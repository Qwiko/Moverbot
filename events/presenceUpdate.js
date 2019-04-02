const tUM = require("../lib/tUM.js");
const log = require("../lib/log.js");
const moveMembers = require("../lib/moveMembers.js");
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
    newChannel = newMember.guild.channels.find(val => val.id === newChannelId);
    //Move all users
    counter = moveMembers(
      client,
      users[newMember.id].drag ? newMember.voiceChannel : newMember,
      newChannel
    );

    log(
      client,
      newMember.user.username,
      newMember.id,
      "Automoved to: '" +
        newMember.guild.channels.find(val => val.id === newChannelId).name +
        "':" +
        newChannelId
    );
    tUM(client, counter);
  });
};
