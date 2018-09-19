const Discord = require("discord.js");
const lib = require('./lib');
const config = require("./files/config.json");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("Moverbot Started");
});

client.on("message", (message) => {
  if (message.channel.type == "text" && message.channel.name == "move" && message.content.startsWith(config.prefix) && typeof message.content !== 'undefined') {


    //Removing prefix and makes the string lowercase
    message.content = message.content.toLowerCase().substring(1);
    //Splitting the message
    msg = message.content.split(" ")



      
    //Loading the guilds dictonary
    try {
      dict = require('./dict/' + message.guild.id + '.json');
      // do stuff
    } catch (err) {
      //console.log(err);
      dict = ""
    }
    channels = []
    var values = Object.values(dict)
    var keys = Object.keys(dict);
    for (i in values) {
      channels.push(keys[i].toLowerCase());
      for (j in values[i]) {
        channels.push(values[i][j])
      }
    }
    //Command interface
    if (msg[0] == "move" || msg[0] == "m" || channels.includes(msg[0].toLowerCase())) {
      lib.move(message, dict, channels);
    } else if (msg[0] == "clear" || msg[0] == "c") {
      lib.clearChannel(message);
    } else if (msg[0] == "alias" || msg[0] == "a") {
      lib.alias(message, dict);
    } else if (msg[0] == "id") {
      lib.idGuild(message)
    } else {
    }
    lib.log(message);
  }
});

client.login(config.token);
