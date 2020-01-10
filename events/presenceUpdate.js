const tools = require("../lib/tools.js");

module.exports = (client, oldMember, newMember) => {
  //console.log("statechange " + newMember.user.username);
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
  tools.loadConfig(data, client.dbGuild, function(config) {
    users = config.users;

    //No data means no users have activated presencemoving.
    if (typeof config.users == "undefined") return;

    //If we can't find information about the user in the database skip, or if they have opted out.
    if (users[newMember.id] == null || users[newMember.id].enabled == false)
      return;

    gamename = newMember.presence.game.name;
    newChannelId = "";

    for (var key in config.alias) {
      if (config.alias[key].includes(gamename)) {
        newChannelId = key;
        break;
      }
    }

    //No channel found.
    if (newChannelId == "") return;

    //Already in right channel
    if (newMember.voiceChannelID == newChannelId) return;

    counter = 0;
    newChannel = newMember.guild.channels.find(val => val.id === newChannelId);
    counter = tools.moveMembers(
      client,
      users[newMember.id].drag ? newMember.voiceChannel : newMember,
      newChannel
    );

    if (!counter) {
      //Channel full, cannot join.
      return;
    }
    tools.log(
      client,
      newMember.user.username,
      newMember.id,
      newMember.guild.id,
      "Automoved to: '" +
        newMember.guild.channels.find(val => val.id === newChannelId).name +
        "':" +
        newChannelId
    );
  });
};
