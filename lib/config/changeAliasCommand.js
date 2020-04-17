const tools = require("../tools.js");

module.exports = function (client, message, args) {
  //Remove first argument
  args.shift();

  if (typeof args[0] == "undefined") {
    message.channel.send(
      "Please provide an argument, valid arguments are: move, join."
    );
    return;
  }

  args[0] = args[0].toLowerCase();
  goodCommands = ["move", "join"];

  if (!goodCommands.includes(args[0])) {
    message.channel.send("Valid arguments are: move, join.");
    return;
  }

  //Check if it is the same prefix.
  if (client.guild.config.aliasCommand == args[0]) {
    message.channel.send("You already have that aliascommand set.");
    return;
  }

  config = client.guild.config;
  config.aliasCommand = args[0];

  message.channel.send("Changed aliascommand to: " + args[0] + ".");
  tools.updateConfig(client, message);
};
