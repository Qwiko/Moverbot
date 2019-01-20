/*
Author: Qwiko
A moverbot for Discord
*/

//Discord setup
const Discord = require("discord.js");
const client = new Discord.Client();

//lib setup and config
client.config = require("./files/config.json");

const log = require('./lib/log.js');
const loadAlias = require('./lib/loadAlias.js');
const loadConfig = require('./lib/loadConfig.js');

//Loading commands
const fs = require("fs");
client.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if(err) console.error(err);

  let jsfiles = files.filter(f => f.split(".").pop() == "js");
  if(jsfiles.length <= 0) {
    console.log("No commands to load");
    return;
  }
  jsfiles.forEach((f, i) => {
    let props = require('./commands/' + f);
    //console.log((i + 1) + ": " + f + " loaded.");

    client.commands.set(props.help.name, props);
    //Setting aliases
    props.help.aliases.forEach(alias => {
      client.commands.set(alias, props);
    });
  });
})


//MongoDB setup and connect to databases
var mongojs = require('mongojs')
client.dbLogs = mongojs("mongodb://localhost:27017/logs")
client.dbAlias = mongojs("mongodb://localhost:27017/alias")


//Connecting to discord with the client
client.on("ready", () => {
  //console.log(`Moverbot has started in ${client.guilds.size} guilds.`); 
  console.log("Moverbot ready");
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
  
  client.user.setActivity('commands', { type: 'LISTENING' })
  //.then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  .catch(console.error);
});


//Waiting for messages
client.on("message", async message => {

  /////////////////////////////////
  //         Permissions         //
  /////////////////////////////////
  //Only accept text channel.
  if (message.channel.type != "text") return;
  //Only accept channel with name move
  if (message.channel.name != "moverbot") return;
  //Dont read bot messages.
  if(message.author.bot) return;

  //Ignores all messages without the prefix
  loadConfig(message, client.dbAlias, function(config) {
    client.config.prefix = config.prefix;
    //console.log(client.config)
    if(!message.content.startsWith(client.config.prefix)) return;
    //If message is only prefix = do nothing
    if(message.content == client.config.prefix) {
      message.channel.send("Please enter a command");
      return;
    }
  });
  var args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();
  var newargs = [];

  //args cleanup
  for (var i = 0; i < args.length; i++) {
    if (args[i].startsWith('"')) {
      newargs[i] = args[i].slice(1); //slice removes "
      if (!args[i].endsWith('"')) {
        j = i+1;
        while(j < args.length) {
            newargs[i] = newargs[i] + " " + args[j];
            if (args[j].endsWith('"')) {
              newargs[i] = newargs[i].slice(0, -1).toLowerCase();
              break;
            }
          j++
        }
        i = j;
      } else {
        newargs[i] = newargs[i].slice(0, -1).toLowerCase();
      }
    } else {
      newargs[i] = args[i].toLowerCase();
    }
  }
  //Returning to original args remove null elements
  args = newargs.filter(function (el) {
    return el != null;
  });

  //Load async alias from MongoDB.
  loadAlias(message, client.dbAlias, function(alias) {
    //Check if command is an alias for a channel.
    for (var key in alias) {
      if (alias[key].includes(command)) {
        args[0] = command;
        command = "move";
        break;
      }
    }
    const cmd = client.commands.get(command);
    if (!cmd) {
      message.channel.send("Cannot handle that command, please try again");
      return;
    }

    cmd.run(client, message, args, alias);
  });
  //Logging every command
  log(message, client.dbLogs);
  }
);

client.login(client.config.token);