const changeAliasCommand = require("../lib/config/changeAliasCommand.js");
const changeChannel = require("../lib/config/changeChannel.js");
const changePrefix = require("../lib/config/changePrefix.js");

validArgs = ["aliascommand", "channel", "prefix"];

exports.run = function(client, message, args) {

  //No valid args are given
  if (!validArgs.includes(args[0])) {
    mes = "Please give a valid argument, valid arguments are: ";
    validArgs.forEach(element => {
      if(validArgs[validArgs.length-1] === element){
        //Last element
        mes = mes + element + ".";
      } else {
        //All other elements
        mes = mes + element + ", ";
      }
      
    });
    message.channel.send(mes)
    return;
  }



  //Arguments are given

  //Check if administrator
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send(
      "You need to be an administrator to change config."
    );
    return;
  }

  //No second argument
  if (typeof args[1] == "undefined") {
    message.channel.send("Please specify a second argument.");
    return;
  }

  //Check the second argument
  if (args[0] == "aliascommand") {
    changeAliasCommand(client, message, args);

  } else if (args[0] == "channel") {

    changeChannel(client, message, args);

  } else if (args[0] == "prefix") {

    changePrefix(client, message, args);
  }
  
};

exports.help = {
  name: "config",
  detail:
    "Change config",
  aliases: ["con"]
};