const log = require('../lib/log.js');
const loadAlias = require('../lib/loadAlias.js');
const loadConfig = require('../lib/loadConfig.js');

//Waiting for messages
module.exports = async (client, message) => {
    /////////////////////////////////
    //         Permissions         //
    /////////////////////////////////
    //Only accept text channel.
    if (message.channel.type != "text") return;
    //Only accept channel with name move
    if (message.channel.name != "moverbot") return;
    //Dont read bot messages.
    if (message.author.bot) return;

    //Ignores all messages without the prefix
    //Load async config from the mongoDB.
    loadConfig(message, client.dbGuild, function (config) {
        client.guild = {}
        client.guild.config = config;
        //console.log(client.config)
        if (!message.content.startsWith(client.guild.config.prefix)) return;
        //If message is only prefix = do nothing
        if (message.content == client.guild.config.prefix) {
            message.channel.send("Please enter a command");
            return;
        }

        var args = message.content.slice(client.guild.config.prefix.length).trim().split(/ +/g);
        var command = args.shift().toLowerCase();
        var newargs = [];

        //args cleanup


        //Create a function for this and pass on "" or ''

        for (var i = 0; i < args.length; i++) {
            if (args[i].startsWith('"')) {
                newargs[i] = args[i].slice(1); //slice removes "
                if (!args[i].endsWith('"')) {
                    j = i + 1;
                    while (j < args.length) {
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
        loadAlias(message, client.dbGuild, function (alias) {
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
    });
    //Logging every command
    log(message, client.dbLogs);
}