const tools = require("../tools.js");

module.exports = function (client, message, args) {
  //Remove first argument
  args.shift();

  if (typeof args[0] == "undefined") {
    message.channel.send(
      "Please provide an argument, valid arguments are: true and false."
    );
    return;
  }

  args[0] = args[0].toLowerCase();
  goodCommands = ["true", "false"];

  if (!goodCommands.includes(args[0])) {
    message.channel.send("Valid arguments are: true and false.");
    return;
  }

  if (args[0] == "true") {
    arg = true;
  } else if (args[0] == "false") {
    arg = false;
  }

  //Check if it is the same prefix.
  if (client.guild.config.botMessages == arg) {
    message.channel.send("You already have that set.");
    return;
  }

  config = client.guild.config;
  config.botMessages = arg;

  if (arg) {
    message.channel.send("Bots can send messages to Moverbot.");
  } else {
    message.channel.send("Bots can not send messages to Moverbot.");
  }

  tools.updateConfig(client, message);
};
