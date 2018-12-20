exports.run = function (client, message, args, alias) {
  dbAlias = client.dbAlias;
  if (args.length == 0) {
    //Show aliases
    aliasMessage = ""
    for (var key in alias) {
      channelName = message.guild.channels.find("id", key).name
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
      aliasMessage = "Aliases for your channel:\n" + aliasMessage
      message.channel.send(aliasMessage)
    } else {
      message.channel.send("You have no aliases configured.")
    }
    return;
  } else {
    const addToAlias = require('../lib/addToAlias.js')
    addToAlias(message, dbAlias, alias, args[0], args[1]);
  }

};
exports.help = {
  name: "alias",
  usage: "!alias",
  aliases: ["a"]
}


