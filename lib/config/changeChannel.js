module.exports = async (client, message, args) => {
  //Remove first argument
  args.shift();

  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide an argument.");
    return {
      success: false,
      message: "Please provide an argument.",
    };
  }

  newChannel = message.guild.channels.cache.find(
    (val) => val.name === args[0] || val.id === args[0]
  );

  if (!newChannel) {
    message.channel.send("That textchannel does not exist.");
    return {
      success: false,
      message: "That textchannel does not exist.",
    };
  }

  //Check if it is the same channel.
  if (client.guild.config.channel == newChannel.id) {
    message.channel.send("You already have that channel set.");
    return {
      success: false,
      message: "You already have that channel set.",
    };
  }

  config = client.guild.config;
  config.channel = newChannel.id;

  message.channel.send("Changed channel to: " + newChannel.name + ".");
  client.lib.db.updateConfig(client, message);
  return {
    success: true,
    message: "Changed channel to: " + newChannel.name + ".",
  };
};
