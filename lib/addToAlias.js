module.exports = function (message, dbAlias, alias, key, value) {
    var aliasColl = dbAlias.collection(message.guild.id)
    
    //Key is channelname
    //Value is the alias we want
    key = key.toLowerCase()
    c = {"channels": alias}

    if (value == "del") {
        for (var keys in alias) {
            var index = alias[keys].indexOf(key);
            if (index > -1) {
                alias[keys].splice(index, 1);
                message.channel.send("Deleting alias: " + key + ".");
            }
            c.channels[keys].shift()
            if (alias[keys].length == 0){
                delete alias[keys];
            }
        }
    } else {
        for (var keys in alias) {
            if (alias[keys].indexOf(key) > -1) {
                if (alias[keys].indexOf(value) > -1) {
                    message.channel.send("This alias is already configured.");
                } else {
                    c.channels[keys].push(value)
                    channelName = message.guild.channels.find("id", keys).name
                    message.channel.send("Added alias: " + value + " as an alias to " + channelName + ".");
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