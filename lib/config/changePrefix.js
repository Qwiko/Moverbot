const tools = require("../tools.js");

module.exports = function (client, message, args) {
  args.shift();

  good_prefixes = ["!", ".", ",", ":", ";", "!!", "..", "--", "-"];

  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide a prefix.");
    return {
      success: false,
      message: "Please provide a prefix.",
    };
  }

  if (args[0].length > 2 || args[0].length == 0) {
    message.channel.send("Your new prefix can maximum be 2 characters.");
    return {
      success: false,
      message: "Your new prefix can maximum be 2 characters.",
    };
  }

  if (!good_prefixes.includes(args[0])) {
    mes = "Your new prefix must be one of the following\n";
    good_prefixes.forEach((element) => {
      mes = mes + element + " ";
    });
    message.channel.send(mes);
    return {
      success: false,
      message: mes,
    };
  }

  //Check if it is the same prefix.
  if (client.guild.config.prefix == args[0]) {
    message.channel.send("You already have that prefix set.");
    return {
      success: false,
      message: "You already have that prefix set.",
    };
  }

  config = client.guild.config;
  config.prefix = args[0];

  message.channel.send("Changed prefix to: " + args[0]);
  tools.updateConfig(client, message);
  return {
    success: true,
    message: "Changed prefix to: " + args[0],
  };
};
