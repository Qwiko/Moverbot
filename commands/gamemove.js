const updateConfig = require("../lib/updateConfig.js");

exports.run = function(client, message, args, alias) {
  //Check if arguments exists and contain what we want
  if (args.length == 0 || !["on", "off"].includes(args[0])) {
    message.channel.send(
      "Usage: " + client.guild.config.prefix + "gamemove on/off"
    );
    return;
  }

  //If no data is found for this guild, create a temporary json array if the user wants to set to on.
  if (typeof client.guild.config.users == "undefined") {
    client.guild.config.users = {};
  }

  if (typeof client.guild.config.users[message.author.id] == "undefined") {
    client.guild.config.users[message.author.id] = {};
    client.guild.config.users[message.author.id].enabled = false;
  }
  
  if (args[0] == "on") {
    config.users[message.author.id].enabled = true;
    m = "Turning on automatic moving for " + message.author.username;
    if (args[1] == "drag") {
      config.users[message.author.id].drag = true;
      m = m + " with drag.";
    } else {
      config.users[message.author.id].drag = false;
      m = m + ".";
    }
    message.channel.send(m);
  } else if (args[0] == "off") {
    for (var v in config.users[message.author.id]) {
      config.users[message.author.id][v] = false;
    }
    message.channel.send(
      "Turning off automatic moving for " + message.author.username + "."
    );
  }

  updateConfig(client, message);
};

exports.help = {
  name: "gamemove",
  detail:
    "Enable or disable automatic moving depending on your game with ${PREFIX}gamemove on/off, optional argument: 'drag', drags with all users from your channel when you switch game.",
  aliases: ["gm"]
};
