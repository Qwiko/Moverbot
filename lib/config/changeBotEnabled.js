const tools = require("../tools.js");

module.exports = function (client, message, args) {
  //Remove first argument
  args.shift();

  if (typeof args[0] == "undefined") {
    message.channel.send(
      "Please provide an argument, valid arguments are: true and false."
    );
    return {
      success: false,
      message:
        "Please provide an argument, valid arguments are: true and false.",
    };
  }

  args[0] = args[0].toLowerCase();
  goodCommands = ["true", "false"];

  if (!goodCommands.includes(args[0])) {
    message.channel.send("Valid arguments are: true and false.");
    return {
      success: false,
      message: "Valid arguments are: true and false.",
    };
  }

  if (args[0] == "true") {
    arg = true;
  } else if (args[0] == "false") {
    arg = false;
  }

  //Check if it is the same prefix.
  if (client.guild.config.botMessages == arg) {
    message.channel.send("You already have that set.");
    return {
      success: false,
      message: "You already have that set.",
    };
  }

  config = client.guild.config;
  config.botMessages = arg;

  if (arg) {
    msg = "Bots can send messages to Moverbot.";
  } else {
    msg = "Bots can not send messages to Moverbot.";
  }
  message.channel.send(msg);
  tools.updateConfig(client, message);
  return {
    success: true,
    message: msg,
  };
};
