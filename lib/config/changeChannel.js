const tools = require("../tools.js");

module.exports = function(client, message, args) {
  //Remove first argument
  args.shift();

  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide an argument.");
    return;
  }

  newChannel = message.guild.channels.find(val => val.name === args[0]);

  if (!newChannel) {
    message.channel.send("That textchannel does not exist.");
    return;
  }

  //Check if it is the same channel.
  if (client.guild.config.channel == newChannel.id) {
    message.channel.send("You already have that channel set.");
    return;
  }

  config = client.guild.config;
  config.channel = newChannel.id;

  message.channel.send("Changed channel to: " + newChannel.name);
  tools.updateConfig(client, message);
};
