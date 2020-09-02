const displayAlias = require("../lib/alias/displayAlias.js");
const deleteAlias = require("../lib/alias/deleteAlias.js");
const hideAlias = require("../lib/alias/hideAlias.js");
const addAlias = require("../lib/alias/addAlias.js");

exports.run = function (client, message, args) {
  if (message.webhookID) {
    message.channel.send("Webhooks cannot be used with that command.");
    return {
      success: false,
      message: "Webhooks cannot be used with that command.",
    };
  }

  if (args.length == 0 || args[0] == "displayall") {
    //If no args are given, display current aliases.
    if (args[0] == "displayall") {
      //Display alias + hidden
      response = displayAlias(client, message, true);
    } else {
      //Don't display hidden aliases
      response = displayAlias(client, message, false);
    }
    return response;
  } else {
    //Arguments are given

    //Check if administrator
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send(
        "You need to be an administrator to add or delete aliases."
      );
      return {
        success: false,
        message: "You need to be an administrator to add or delete aliases.",
      };
    }

    //No second argument
    if (typeof args[1] == "undefined") {
      message.channel.send("Please specify a second argument.");
      return {
        success: false,
        message: "Please specify a second argument.",
      };
    }

    //Check the second argument
    if (args[0] == "del") {
      response = deleteAlias(client, message, args);
    } else if (args[0] == "hide") {
      response = hideAlias(client, message, args);
    } else {
      response = addAlias(client, message, args);
    }
    return response;
  }
};

exports.help = {
  name: "alias",
  detail:
    "See current aliases and create new ones with: ${PREFIX}alias CHANNELNAME alias.\nDelete aliases with ${PREFIX}alias del alias and hide aliases with ${PREFIX}alias hide alias.\nDisplay hidden aliases with ${PREFIX}alias displayall.\n${PREFIX}alias works aswell to move between channels.",
  enabled: true,
  aliases: ["a"],
};
