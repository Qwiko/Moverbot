const addToAlias = require('../lib/aliasTools.js');

exports.run = function (client, message, args, alias) {
  if (args.length == 0) {
    message.delete();
    //Show aliases
    aliasMessage = ""
    for (var key in alias) {
      channelName = message.guild.channels.find(val => val.id === key).name
      arrayKey = alias[key];
      arrayKey.shift()
      //Show only those who have aliases
      if (arrayKey.length > 0) {
        aliasMessage += "**" + channelName + "**" + " = "
        for (i in arrayKey) {
          if (arrayKey[i].length >= 6) continue;
          aliasMessage += arrayKey[i] + (i < arrayKey.length - 1 ? ', ' : '')
          //console.log(channelName)
        }
        aliasMessage += "\n"
      }
    }
    if (aliasMessage.trim().length > 0) {
      //aliasMessage = "Aliases:\n" + aliasMessage
      message.channel.send({
        embed: {
          title: "Aliases",
          color: 0x43b581,
          description: aliasMessage
        }
      });
    } else {
      message.channel.send("You have no aliases configured.")
    }
    return;
  } else {
    addToAlias(client, message, alias, args);
  }
};
exports.help = {
  name: "alias",
  detail: "See current aliases and create new ones with: ${PREFIX}alias CHANNELNAME alias.",
  aliases: ["a"]
}