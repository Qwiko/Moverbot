module.exports = function (client, message, args) {
  //Remove first argument
  args.shift();

  if (typeof args[0] == "undefined") {
    message.channel.send(
      "Please provide an argument, valid arguments are: move, join."
    );
    return {
      success: false,
      message: "Please provide an argument, valid arguments are: move, join.",
    };
  }

  args[0] = args[0].toLowerCase();
  goodCommands = ["move", "join"];

  if (!goodCommands.includes(args[0])) {
    message.channel.send("Valid arguments are: move, join.");
    return {
      success: false,
      message: "Valid arguments are: move, join.",
    };
  }

  //Check if it is the same prefix.
  if (client.guild.config.aliasCommand == args[0]) {
    message.channel.send("You already have that aliascommand set.");
    return {
      success: false,
      message: "You already have that aliascommand set.",
    };
  }

  config = client.guild.config;
  config.aliasCommand = args[0];

  message.channel.send("Changed aliascommand to: " + args[0] + ".");
  client.lib.updateConfig(client, message);
  return {
    success: true,
    message: "Changed aliascommand to: " + args[0] + ".",
  };
};
