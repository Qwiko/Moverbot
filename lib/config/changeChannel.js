const tools = require("../tools.js");

module.exports = function(client, message, args) {
  //Remove first argument
  args.shift();

  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide an argument.");
    return;
  }

  //Get all textchannels in an array
  textChannels = [];
  message.guild.channels.forEach(GuildChannel => {
    if (GuildChannel.type == "text") {
      textChannels.push(GuildChannel.name);
    }
  });

  //Check if the textchannel exists
  if (!textChannels.includes(args[0])) {
    message.channel.send("That textchannel does not exist.");
    return;
  }

  //Check if it is the same prefix.
  if (client.guild.config.channel == args[0]) {
    message.channel.send("You already have that channel set.");
    return;
  }

  config = client.guild.config;
  config.channel = args[0];

  message.channel.send("Changed channel to: " + args[0]);
  tools.updateConfig(client, message);
};
