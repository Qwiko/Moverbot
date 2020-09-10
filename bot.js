/*
Author: Qwiko
A moverbot for Discord
*/

//Discord setup
const Discord = require("discord.js");
const client = new Discord.Client();

//lib setup and config
client.config = require("./files/config.json");

const fs = require("fs");

client.lib = require("./lib");

//db setup
client.lib.db.create(client);

//Loading events
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();

//Loading commands
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    //console.log(`Attempting to load command ${commandName}`);
    if (props.help.enabled) {
      //Load only enabled commands
      client.commands.set(commandName, props);
      //Setting aliases
      props.help.aliases.forEach((alias) => {
        client.commands.set(alias, props);
      });
    }
  });
});

client.login(client.config.token);
