module.exports = function (client, message, alias, args) {
    var aliasColl = client.dbAlias.collection(message.guild.id)

    //arg1 is channelname
    //arg2 is the alias we want

    forbiddenAliases = ["del"]
    client.commands.forEach(cmd => {
        if (!forbiddenAliases.includes(cmd.help.name)) {
            forbiddenAliases.push(cmd.help.name);
        }
        cmd.help.aliases.forEach(c => {
            if (!forbiddenAliases.includes(c)) {
                forbiddenAliases.push(c)
            }
        });
    });

    arg1 = args[0];
    arg2 = args[1];
    c = {"channels": alias}

    //Must pass on a second argument.
    if (typeof arg2 == "undefined" ){
        message.channel.send("Please specify the second argument.");
        return;
    }

    //Cannot use forbidden aliases.
    if (forbiddenAliases.includes(arg2)) {
        message.channel.send("You cannot use that as a second argument.");
        return;
    }

    //alias del function
    if (arg1 == "del") {
        for (var keys in alias) {
            if (alias[keys].indexOf(arg2) > -1) {
                alias[keys].splice(index, 1);
                message.channel.send("Deleting alias: *" + arg2 + "*.");
            } else {
            }
            c.channels[keys].shift()
            if (alias[keys].length == 0){
                delete alias[keys];
            }
        }
    } else {
        for (var keys in alias) {
            if (alias[keys].indexOf(arg1) > -1) {
                if (alias[keys].indexOf(arg2) > -1) {
                    message.channel.send("This alias is already configured.");
                } else {
                    c.channels[keys].push(arg2)
                    channelName = message.guild.channels.find(val => val.id === keys).name
                    message.channel.send("Added alias: *" + arg2 + "* as an alias to " + channelName + ".");
                } 
            } else {
            }
            c.channels[keys].shift()
            if (alias[keys].length == 0){
                delete alias[keys];
            }
        }
    }
    //Update mongodb.
    aliasColl.update({_id: "aliases"}, {$set: c}, {upsert:true, w: 1}, function () {
    })
}