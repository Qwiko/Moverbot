module.exports = async function (message, dbAlias, callback) {
    var guild = dbAlias.collection(message.guild.id);

    guild.findOne({_id: "aliases"}, function(err, doc) {
        alias = {}
        if (doc === null) {
            for (let [snowflake, GuildChannel] of message.guild.channels) {
                if (GuildChannel.type == "voice") {
                    alias[snowflake] = [GuildChannel.name.toLowerCase()];
                }
            }
        } else {
            aliasDict = doc.channels;
            for (let [snowflake, GuildChannel] of message.guild.channels) {
                if (GuildChannel.type == "voice") {
                    if (typeof aliasDict[snowflake] !== "undefined") {
                        alias[snowflake] = aliasDict[snowflake]
                        alias[snowflake].unshift(GuildChannel.name.toLowerCase())
                    } else {
                        alias[snowflake] = [GuildChannel.name.toLowerCase()]
                    }
                }
            }
        }
        callback(alias)
    })
}


