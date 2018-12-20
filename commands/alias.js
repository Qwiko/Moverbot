exports.run = function (client, message, args, alias, dbAlias) {
  
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




  //message.guild.channels.find("id", newChannelId).name

  /*
  msg = message.content.substring(1).toLowerCase();
  
  if (msg.startsWith("alias ") || msg.startsWith("a ") ) {
    msg = msg.trim();
  }
  add = []
  if (msg.length > 5) {
    //Adding aliases with ""
    if (msg.includes('"')) {
      var pos = [];
      for(var i = 0; i < msg.length; i++) {
        if (msg[i] === '"') pos.push(i);
      }
      add[0] = msg.substring(pos[0]+1, pos[1])
      add[1] = msg.substring(pos[2]+1, pos[3])
      if (add[0].length <= 1 || add[1].length <= 1) {
        message.channel.send("Your aliases cannot only be 1 character long")
      } else {
        //Adding aliases
        addAlias(message, dbAlias, alias, add[1], add[0]);
      }
    } else {
      //Adding aliases without ""
      msg = msg.split(" ");
      msg.shift();
      if (msg[0].length <= 1 || msg[1].length <= 1) {
        message.channel.send("Your aliases cannot only be 1 character long")
      } else {
        //Adding aliases
        addAlias(message, dbAlias, alias, msg[1], msg[0]);
      }

    }
  } else {
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
   
  }*/
};

exports.help = {
  name: "alias",
  usage: "!alias",
  aliases: ["a"]
}

function addAlias(m, dbAliases, aliases, keyn, valuen) {
  addToAlias = require('./addToAlias.js')
  addToAlias(m, dbAliases, aliases, keyn, valuen);
}


