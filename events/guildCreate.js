const tools = require("../lib/tools.js");

module.exports = (client, guild) => {
  guild.owner.send(
    "Hello " +
      guild.owner.user.username +
      ", owner of " +
      guild.name +
      ".\nPlease create a textchannel named moverbot and write !help to start using Moverbot!\nAutomation of this process is being developed."
  );

  tools.log(
    client,
    guild.name,
    guild.id,
    "log",
    "Joined a new guild: " + guild.name + " with id: " + guild.id,
    (server = true)
  );
};
