module.exports = async function (message, dbAlias, callback) {
    var guild = dbAlias.collection(message.guild.id);

    guild.findOne({_id: "aliases"}, function(err, doc) {
        alias = {}
        if (doc === null) {
            message.guild.channels.forEach(GuildChannel => {
                if (GuildChannel.type == "voice") {
                    alias[GuildChannel.id] = [GuildChannel.name.toLowerCase()];
                }
            })
        } else {
            aliasDict = doc.channels;
            message.guild.channels.forEach(GuildChannel => {
                snowflake = GuildChannel.id;
                if (GuildChannel.type == "voice") {
                    if (typeof aliasDict[snowflake] !== "undefined") {
                        alias[snowflake] = aliasDict[snowflake]
                        alias[snowflake].unshift(GuildChannel.name.toLowerCase())
                    } else {
                        alias[snowflake] = [GuildChannel.name.toLowerCase()]
                    }
                }
            });
        }
        callback(alias)
    })
}