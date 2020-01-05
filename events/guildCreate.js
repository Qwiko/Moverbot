const log = require("../lib/log.js");

module.exports = (client, guild) => {

  guild.owner.send(
    "Hello " +
      guild.owner.user.username +
      ", owner of " +
      guild.name +
      ".\nPlease create a textchannel named moverbot and write !help to start using Moverbot!\nAutomation of this process is being developed."
  );

  log(
    client,
    guild.owner.user.username,
    guild.owner.id,
    "log",
    "Joined a new guild: " + guild.name + " with id: " + guild.id,
    "dbConfig"
  );

};
