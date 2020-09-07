module.exports = function (client, channel) {
  return channel.guild.members.cache
    .get(client.user.id)
    .permissionsIn(channel)
    .has("MOVE_MEMBERS");
};
