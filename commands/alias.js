const displayAlias = require('../lib/alias/displayAlias.js');
const deleteAlias = require('../lib/alias/deleteAlias.js');
const addAlias = require('../lib/alias/addAlias.js');

exports.run = function (client, message, args, alias) {
  if (args.length == 0) {
    //If no args are given, display current aliases.
    displayAlias(message, alias);
  } else { //Arguments are given
    //No second argument
    if (typeof args[1] == "undefined") {
      message.channel.send("Please specify a second argument.");
      return;
    }
    if (args[0] == "del") {
      deleteAlias(client, message, args, alias);
    } else {
      addAlias(client, message, args, alias);
    }
  }
}

exports.help = {
  name: "alias",
  detail: "See current aliases and create new ones with: ${PREFIX}alias CHANNELNAME alias.",
  aliases: ["a"]
}
