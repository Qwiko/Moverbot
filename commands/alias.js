const addToAlias = require('../lib/aliasTools.js');

exports.run = function (client, message, args, alias) {
  if (args.length == 0) {
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
          aliasMessage += arrayKey[i] + (i < arrayKey.length-1 ? ', ' : '')
          //console.log(channelName)
        }
        aliasMessage += "\n"
      }
    }
    if (aliasMessage.trim().length > 0){ 
      aliasMessage = "Aliases:\n" + aliasMessage
      message.channel.send(aliasMessage)
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
  usage: "!alias",
  aliases: ["a"]
}