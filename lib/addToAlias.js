module.exports = function (message, dbAlias, alias, args) {
    var aliasColl = dbAlias.collection(message.guild.id)
    //console.log(alias);
    //arg1 is channelname
    //arg2 is the alias we want
    arg1 = args[0];
    arg2 = args[1];
    c = {"channels": alias}
    console.log(arg1 + " : " + arg2)
    if (arg1 == "del") {
        for (var keys in alias) {
            var index = alias[keys].indexOf(arg2);
            if (index > -1) {
                alias[keys].splice(index, 1);
                message.channel.send("Deleting alias: *" + arg2 + "*.");
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
                    channelName = message.guild.channels.find(val => val.id === key).name
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
    aliasColl.update({_id: "aliases"}, {$set: c}, {upsert:true, w: 1}, function () {
    })
}