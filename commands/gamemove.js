exports.run = function (client, message, args, alias) {
    users = client.guild.config.users;

    //Check if arguments exists and contain what we want
    if (args.length == 0 || !["on", "off"].includes(args[0])) {
        message.channel.send("Usage: " + client.guild.config.prefix + "gamemove on/off");
        return;
    }

    //If no data is found for this guild, create a temporary json array if the user wants to set to on.
    if (typeof users == "undefined") {
        users = {}
        client.guild.config.users = {}
    }
    if (typeof users[message.author.id] == "undefined") {
        users[message.author.id] == false;
    }

    if (args[0] == "on") {
        if (users[message.author.id]) {
            message.channel.send("Automatic moving is already on for " + message.author.username + ".");
            return;
        }
        set = true;
        //console.log("Setting to true")
        message.channel.send("Turning on automatic moving for " + message.author.username + ".");
    } else if (args[0] == "off") {
        if (!users[message.author.id]) {
            message.channel.send("Automatic moving is already off for " + message.author.username + ".");
            return;
        }
        set = false;
        //console.log("Setting to false")
        message.channel.send("Turning off automatic moving for " + message.author.username + ".");
    }
    config = client.guild.config;
    config.users[message.author.id] = set

    client.dbGuild.collection(message.guild.id).update({
        _id: "config"
    }, {
        $set: {
            config
        }
    }, {
        upsert: true,
        w: 1
    }, function () {})
};

exports.help = {
    name: "gamemove",
    detail: "Enable or disable automatic moving depending on your game with ${PREFIX}gamemove on/off.",
    aliases: ["g"]
}