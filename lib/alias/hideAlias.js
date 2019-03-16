const updateConfig = require("../updateConfig.js");

module.exports = function(client, message, args) {
  hiddenAliases = [];

  if (
    typeof client.guild.config.hidden == "undefined" ||
    client.guild.config.hidden.length == 0
  ) {
    client.guild.config.hidden = [];
  }

  args.forEach(arg => {
    //Check if there are any aliases for us to hide
    for (a in client.guild.config.alias) {
      if (
        client.guild.config.alias[a].includes(arg) &&
        !client.guild.config.hidden.includes(arg)
      ) {
        hiddenAliases.push(arg);
        client.guild.config.hidden.push(arg);
      }
    }
  });
  if (hiddenAliases.length == 0) {
    message.channel.send("Aliases is either hidden or isn't configured.");
    return;
  }
  m = "Hidden alias" + (hiddenAliases.length == 1 ? "" : "es") + ": ";
  hiddenAliases.forEach(a => {
    m =
      m + a + (hiddenAliases.indexOf(a) < hiddenAliases.length - 1 ? ", " : "");
  });
  message.channel.send(m + ".");
  updateConfig(client, message);
};
