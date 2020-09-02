const tools = require("../lib/tools.js");

module.exports = (client, guild) => {
  msg = {
    author: { username: guild.name, id: guild.id },
    content: "Leaved guild: " + guild.name + " with id: " + guild.id,
    guild: { id: guild.id },
  };
  response = {
    success: true,
    message: "Leaved guild: " + guild.name + " with id: " + guild.id,
  };

  tools.log(client, msg, response, (server = true));
};
