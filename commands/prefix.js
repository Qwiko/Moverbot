exports.run = function (client, message, args) {
    good_prefixes = [
        "!",
        ".",
        ",",
        ":",
        ";"
    ]

    if (typeof args[0] == "undefined") {
        message.channel.send("Please provide a prefix.");
        return;
    }

    if (args[0].length != 1) {
        message.channel.send("Your new prefix must be only 1 character.");
        return;
    }

    if (!good_prefixes.includes(args[0])) {
        mes = "Your new prefix must be one of the following\n";
        good_prefixes.forEach(element => {
            mes = mes + element + " ";
        })
        message.channel.send(mes);
        return;
    }

    //Check if it is the same prefix.
    if (client.config.prefix == args[0]) {
        message.channel.send("You already have that prefix set.");
        return;
    }

    message.channel.send("Changed prefix to: " + args[0]);
    client.dbAlias.collection(message.guild.id).update({_id: "config"}, {$set: {"config":{"prefix":args[0]}}}, {upsert:true, w: 1}, function () {
    })
    
}

exports.help = {
    name: "prefix",
    usage: "Change prefix for moverbot with: prefix NEW_PREFIX",
    aliases: []
}