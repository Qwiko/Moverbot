const tools = require("../lib/tools.js");

module.exports = (client, guild) => {
  tools.log(
    client,
    guild.name,
    guild.id,
    "log",
    "Leaved guild: " + guild.name + " with id: " + guild.id,
    (server = true)
  );
};
