const displayAlias = require("../lib/alias/displayAlias.js");
const deleteAlias = require("../lib/alias/deleteAlias.js");
const hideAlias = require("../lib/alias/hideAlias.js");
const addAlias = require("../lib/alias/addAlias.js");

exports.run = function(client, message, args) {
  if (args.length == 0 || args[0] == "displayall") {
    //If no args are given, display current aliases.
    if (args[0] == "displayall") {
      //Display alias + hidden
      displayAlias(client, message, true);
    } else {
      //Don't display hidden aliases
      displayAlias(client, message, false);
    }
  } else {
    //Arguments are given

    //Check if administrator
    if (!message.member.has("ADMINISTRATOR")) {
      message.channel.send(
        "You need to be a administrator to add or delete aliases."
      );
      return;
    }

    //No second argument
    if (typeof args[1] == "undefined") {
      message.channel.send("Please specify a second argument.");
      return;
    }

    //Check the second argument
    if (args[0] == "del") {
      deleteAlias(client, message, args);
    } else if (args[0] == "hide") {
      hideAlias(client, message, args);
    } else {
      addAlias(client, message, args);
    }
  }
};

exports.help = {
  name: "alias",
  detail:
    "See current aliases and create new ones with: ${PREFIX}alias CHANNELNAME alias.\nDelete aliases with ${PREFIX}alias del alias and hide aliases with ${PREFIX}alias hide alias.\nDisplay hidden aliases with ${PREFIX}alias displayall.\n${PREFIX}alias works aswell to move between channels.",
  aliases: ["a"]
};
