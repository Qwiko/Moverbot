module.exports = async (client, message, args) => {
  alias = client.guild.config.alias;
  arg1 = args[0];
  //Remove first argument which is either del or a channelalias/name
  args.shift();
  update = true;
  forbiddenAliases = ["del", "displayall", "hide"];
  addedAliases = [];

  //Check if channel exist
  for (a in alias) {
    if (alias[a].includes(arg1)) {
      channelExist = true;
      channelId = a;
      break;
    } else {
      channelExist = false;
    }
  }
  if (!channelExist) {
    message.channel.send("Please specify a valid channelname.");
    return {
      success: false,
      message: "Please specify a valid channelname.",
    };
  }

  //Adding commandnames and aliases as forbidden aliases.
  client.commands.forEach((cmd) => {
    if (!forbiddenAliases.includes(cmd.help.name)) {
      forbiddenAliases.push(cmd.help.name);
      cmd.help.aliases.forEach((c) => {
        forbiddenAliases.push(c);
      });
    }
  });
  //Loop all args and find if someone cannot be used.
  args.forEach((arg) => {
    if (forbiddenAliases.includes(arg)) {
      message.channel.send("The alias *" + arg + "* cannot be used.");
      update = false;
      return {
        success: false,
        message: "The alias *" + arg + "* cannot be used.",
      };
    }
    //Check if some argument already are configured as an alias.
    for (a in alias) {
      if (alias[a].includes(arg)) {
        message.channel.send("The alias *" + arg + "* is already configured.");
        update = false;
        return {
          success: false,
          message: "The alias *" + arg + "* is already configured.",
        };
      }
    }
  });

  //If anything is wrong don't do more
  if (!update) {
    return {
      success: false,
      message: "The alias cannot be used or is already in use",
    };
  }

  //Adding aliases
  args.forEach((arg) => {
    for (a in alias) {
      if (alias[a].includes(arg1)) {
        //The channel is found and an alias can be introduced.
        alias[a].push(arg);
        addedAliases.push(arg);
      }
    }
  });

  m = "Added alias" + (addedAliases.length == 1 ? "" : "es") + ": ";
  addedAliases.forEach((a) => {
    m = m + a + (addedAliases.indexOf(a) < addedAliases.length - 1 ? ", " : "");
  });
  m =
    m +
    " for channel: " +
    message.guild.channels.cache.find((val) => val.id === channelId).name +
    ".";
  message.channel.send(m);
  //Update database
  client.lib.db.updateConfig(client, message);
  return {
    success: true,
    message: m,
  };
};
