/*
Author: Qwiko
A moverbot for Discord
*/

//Discord setup
const Discord = require("discord.js");
const client = new Discord.Client();

//lib setup and config
const config = require("./files/config.json");

const log = require('./lib/log.js');
const loadAlias = require('./lib/loadAlias.js');

//
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
    console.log((i + 1) + ": " + f + " loaded.");
    client.commands.set(props.help.name, props);
  });
})


//MongoDB setup and connect to databases
var mongojs = require('mongojs')
var dbLogs = mongojs("mongodb://localhost:27017/logs")
var dbAlias = mongojs("mongodb://localhost:27017/alias")




//Connecting to discord with the client
client.on("ready", () => {
  console.log(`Moverbot has started in ${client.guilds.size} guilds.`); 
  //console.log("Moverbot ready");
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
});



//Waiting for messages
client.on("message", async message => {

  ////////////////////////////////
  //        Permissions         //
  ////////////////////////////////

  //Only accept text channel.
  if (message.channel.type != "text") return;
  //Only accept channel with name move
  if (message.channel.name != "moverbot") return;
  //Dont read bot messages.
  if(message.author.bot) return;
  //Ignores all messages without the prefix
  if(!message.content.startsWith(config.prefix)) return;
  //If message is only prefix = do nothing
  if(message.content == config.prefix) {
    message.channel.send("Please enter a command");
    return;
  }

  var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
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
      }
    } else {
      newargs[i] = args[i].toLowerCase();
    }
  }
  //Returning to original args
  args = newargs.filter(function (el) {
    return el != null;
  });
  //Check aliases for commands
  if (typeof client.commands[command] !== "function") {
    for (let [comm, func] of client.commands) { 
      //console.log(func.help.aliases);
      func.help.aliases.forEach(function(alias) {
        if (command == alias) {
          command = func.help.name;
          return;
        }
      });
    }
  }
  


  loadAlias(message, dbAlias, function(alias) {
    //Run the command
    for (var key in alias) {
      for (i in alias[key]) {
        if (command == alias[key][i]) {
          command = "move"
          args[0] = alias[key][i]
          break;
        }
      }
    }
    const cmd = client.commands.get(command);
    if (!cmd) return;




    cmd.run(client, message, args, alias, dbAlias);
  });
  //Logging every command
  log(message, dbLogs);
  


 
  }
);

client.login(config.token);