const tools = require("../lib/tools.js");

module.exports = (client, guild) => {
  message = {
    author: { username: guild.name, id: guild.id },
    content: "Leaved guild: " + guild.name + " with id: " + guild.id,
    guild: { id: guild.id },
  };
  response = {
    success: true,
    message: "Leaved guild: " + guild.name + " with id: " + guild.id,
  };

  tools.log(client, message, response, (server = true));
};
