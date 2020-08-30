const changeAliasCommand = require("../lib/config/changeAliasCommand.js");
const changeChannel = require("../lib/config/changeChannel.js");
const changePrefix = require("../lib/config/changePrefix.js");
const changeBotEnabled = require("../lib/config/changeBotEnabled.js");

validArgs = ["aliascommand", "channel", "prefix", "bot"];

exports.run = function (client, message, args) {
  if (args.length === 0) {
    //Display current settings:
    mes = "";
    noDisplay = [
      "alias",
      "gamemove",
      "last_updated",
      "language",
      "hidden",
      "guild",
    ];

    for (key in client.guild.config) {
      if (noDisplay.includes(key)) continue;
      if (key === "channel") {
        mes +=
          "**" +
          key +
          "**: " +
          message.guild.channels.find(
            (val) =>
              val.id === client.guild.config[key] ||
              val.name === client.guild.config[key]
          ).name +
          "\n";
        continue;
      }
      mes += "**" + key + "**: " + client.guild.config[key] + "\n";
    }

    message.channel.send({
      embed: {
        title: "Current config",
        color: 0x43b581,
        description: mes,
      },
    });
    return;
  }

  //No valid args are given
  if (!validArgs.includes(args[0])) {
    mes = "Please give a valid argument, valid arguments are: ";
    validArgs.forEach((element) => {
      if (validArgs[validArgs.length - 1] === element) {
        //Last element
        mes = mes + element + ".";
      } else {
        //All other elements
        mes = mes + element + ", ";
      }
    });
    message.channel.send(mes);
    return;
  }

  //Arguments are given

  //Check if administrator
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send("You need to be an administrator to change config.");
    return;
  }

  //Check the second argument
  if (args[0] == "aliascommand") {
    changeAliasCommand(client, message, args);
  } else if (args[0] == "channel") {
    changeChannel(client, message, args);
  } else if (args[0] == "prefix") {
    changePrefix(client, message, args);
  } else if (args[0] == "bot") {
    changeBotEnabled(client, message, args);
  }
};

exports.help = {
  name: "config",
  detail: "Change config for your server.",
  enabled: true,
  aliases: ["con"],
};
