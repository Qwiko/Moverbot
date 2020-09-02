const tools = require("../lib/tools.js");

module.exports = (client, guild) => {
  guild.owner.send(
    "Hello " +
      guild.owner.user.username +
      ", owner of " +
      guild.name +
      ".\nPlease create a textchannel named moverbot and write !help to start using Moverbot!"
  );

  message = {
    author: { username: guild.name, id: guild.id },
    content: "Joined a new guild: " + guild.name + " with id: " + guild.id,
    guild: { id: guild.id },
  };
  response = {
    success: true,
    message: "Joined a new guild: " + guild.name + " with id: " + guild.id,
  };

  tools.log(client, message, response, (server = true));
};
