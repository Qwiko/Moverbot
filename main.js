/*
Author: Qwiko
A moverbot for Discord
*/

//Discord setup
const Discord = require("discord.js");
const client = new Discord.Client();

//lib setup and config
const lib = require('./lib');
const config = require("./files/config.json");

//MongoDB setup and connect to databases
var mongojs = require('mongojs')
var dbLogs = mongojs("mongodb://localhost:27017/logs")
var dbAlias = mongojs("mongodb://localhost:27017/alias")




//Connecting to discord with the client
client.on("ready", () => {
  //console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  console.log("Moverbot ready");
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
  

  
});


//Waiting for messages
client.on("message", (message) => {

  ////////////////////////////////
  //        Permissions         //
  ////////////////////////////////

  //Only accept text channel.
  if (message.channel.type != "text") return;
  //Only accept channel with name move
  if (message.channel.name != "move") return;

  //Dont read bot messages.
  if(message.author.bot) return;
  
  //Ignores all messages without the prefix
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  //If message is only prefix = do nothing
  if(message.content == config.prefix) {
    message.channel.send("Please enter a command");
    return;
  }

  //Message to lowercase and splitting it
  msg = message.content.toLowerCase().split(" ");

  p = config.prefix;
    //Command interface
  if (msg[0] == p + "clear" || msg[0] == p + "c") {
      lib.clearChannel(message);
    } else if (msg[0] == p + "id") {
      lib.idGuild(message)
    } else {
      lib.loadAlias(message, dbAlias, function(result) {
        if (msg[0] == p + "alias" || msg[0] == p + "a") {
          lib.alias(message, result, dbAlias);
        } else {
          lib.move(message, result);
        }
      });
    }
    //Logging every command
    lib.log(message, dbLogs);
  }
);

client.login(config.token);
