module.exports = async (client, oldPresence, newPresence) => {
  //Do not read bot updates.
  if (newPresence.user.bot) return;
  //Not in a voiceChannel
  if (typeof newPresence.member.voice == "undefined") return;
  //Update does not refer to a game change.
  if (typeof newPresence.activities[0] == "undefined") return;
  //Only type playing
  if (newPresence.activities[0].type != "PLAYING") return;

  if (!oldPresence) return;
  if (!newPresence) return;

  //Does not move while the user changes status.
  if (oldPresence.status != newPresence.status) return;
  //Load config
  config = await client.lib.db.loadConfig(client, newPresence.guild);

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
  userEnabled = false;
  drag = false;

  //If we can't find information about the user in the database skip, or if they have opted out.
  if (users[newPresence.userID] != null) {
    if (users[newPresence.userID].enabled == false) {
      return;
    }
    userEnabled = users[newPresence.userID].enabled;
    drag = users[newPresence.userID].drag;
  }

  gamename = newPresence.activities[0].name;
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
  if (newPresence.member.voice.channelID == newChannelId) return;
  //Grabbing guild
  guild = newPresence.guild;
  includedInRole = false;
  for (var id in roles) {
    role = guild.roles.cache.find((role) => role.id === id);
    member = role.members.get(newPresence.userID);
    if (member) {
      includedInRole = true;
      if (!drag) {
        drag = roles[role.id].drag;
      }
    }
  }

  //Not found in a role, no move.
  if (!includedInRole && !userEnabled) return;

  //counter = 0;
  newChannel = guild.channels.cache.find((val) => val.id === newChannelId);
  // counter = tools.moveMembers(
  //   client,
  //   drag ? newPresence.member.voice.channelID : newPresence.member,
  //   newChannel
  // );

  var counter = await client.lib.move.channel(
    client,
    drag ? newPresence.member.voice.channelID : newPresence.member,
    newChannel
  );

  msg = {
    author: { username: newPresence.user.username, id: newPresence.userID },
    content:
      "Automoved to: '" +
      newPresence.guild.channels.cache.find((val) => val.id === newChannelId)
        .name +
      "':" +
      newChannelId,
    guild: { id: newPresence.guild.id },
  };

  if (!counter) {
    //Channel full, cannot join.
    client.lib.log(client, msg, {
      success: false,
      message: "Channel full",
    });
    return;
  }

  client.lib.log(client, msg, {
    success: true,
    message: msg.content,
    usersmoved: counter,
  });
};
