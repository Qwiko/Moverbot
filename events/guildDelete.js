module.exports = (client, guild) => {
  msg = {
    author: { username: guild.name, id: guild.id },
    content: "Left guild: " + guild.name + " with id: " + guild.id,
    guild: { id: guild.id },
  };
  response = {
    success: true,
    message: "Left guild: " + guild.name + " with id: " + guild.id,
  };

  client.lib.log(client, msg, response, (server = true));
};
