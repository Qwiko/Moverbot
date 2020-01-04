/*
Author: Qwiko
A moverbot for Discord
*/

//Discord setup
const Discord = require("discord.js");
const client = new Discord.Client();

//lib setup and config
client.config = require("./files/config.json");

//For testing
//client.config = require("./files/config_test.json");

const fs = require("fs");

//Mongojs setup
var mongojs = require("mongojs");

client.dbLogs = mongojs(client.config.serverip + "/logs" + client.config.options);
client.dbGuild = mongojs(client.config.serverip + "/guilds" + client.config.options);
client.dbConfig = mongojs(client.config.serverip + "/serverconfig" + client.config.options);

//Loading events
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    //console.log(eventName);
    if(eventName != "voiceStateUpdate") client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();

//Loading commands
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    //console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
    //Setting aliases
    props.help.aliases.forEach(alias => {
      client.commands.set(alias, props);
    });
  });
});

client.login(client.config.token);
