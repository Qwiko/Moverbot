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

  //Load config
  tools.loadConfig(client, newMember.guild, function (config) {
    //No data means no users have activated presencemoving.
    if (
      !(
        Object.keys(config.gamemove.users).length +
        Object.keys(config.gamemove.roles).length
      )
    ) {
      return;
    }

    users = config.gamemove.users;
    roles = config.gamemove.roles;
    drag = false;

    //If we can't find information about the user in the database skip, or if they have opted out.
    if (users[newMember.id] != null) {
      if (users[newMember.id].enabled == false) {
        return;
      }
      drag = users[newMember.id].drag;
    }

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
    //Grabbing guild
    guild = newMember.guild;
    includedInRole = false;
    for (var id in roles) {
      role = guild.roles.find((role) => role.id === id);
      member = role.members.find((member) => member.id == newMember.id);
      if (member) {
        includedInRole = true;
        if (!drag) {
          drag = roles[role.id].drag;
        }
      }
    }

    //Not found in a role, no move.
    if (!includedInRole) return;

    counter = 0;
    newChannel = guild.channels.find((val) => val.id === newChannelId);
    counter = tools.moveMembers(
      client,
      drag ? newMember.voiceChannel : newMember,
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
        newMember.guild.channels.find((val) => val.id === newChannelId).name +
        "':" +
        newChannelId
    );
  });
};
