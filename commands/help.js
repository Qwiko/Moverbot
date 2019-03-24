const helpMessage = require("../lib/helpMessage.js");

exports.run = function(client, message, args, alias) {
  //Prints out the helpmessage for the user.
  helpMessage(client, message);
};

exports.help = {
  name: "help",
  detail: "Shows this help-message.",
  aliases: ["h"]
};
