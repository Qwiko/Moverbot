const helpMessage = require('../lib/helpMessage.js');

exports.run = function (client, message, args, alias) {
    //Prints out the helpmessage for the user.
    helpMessage(message, client);
}

exports.help = {
    name: "help",
    detail: "Shows the help-message.",
    aliases: ["h"]
}