const fs = require("fs");

module.exports = function(client, message) {
  m = [];

  client.commands.forEach(cmd => {
    bool = false;
    //console.log(cmd.help);
    a = cmd.help.aliases;
    name = client.guild.config.prefix + cmd.help.name;
    if (a.length >= 0) {
      a.forEach(alias => {
        name = name + "/" + client.guild.config.prefix + alias;
      });
    }
    cmd.help.detail = cmd.help.detail
      .split("${PREFIX}")
      .join(client.guild.config.prefix);
    n = {
      name: name,
      value: cmd.help.detail
    };
    for (i = 0; i < m.length; i++) {
      if (m[i].name == n.name) {
        bool = true;
      }
    }
    if (!bool) {
      m.push(n);
    }
  });
  m.push({
    name: "Wiki page",
    value:
      "Visit https://github.com/Qwiko/Moverbot/wiki for more detailed information about the commands."
  });
  message.channel.send({
    embed: {
      title: "Commands to use the bot:",
      color: 0x43b581,
      fields: m
    }
  });
};
