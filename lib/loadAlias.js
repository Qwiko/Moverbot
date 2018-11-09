module.exports = async function (message, dbAlias, callback) {
    var guildAlias = dbAlias.collection(message.guild.id);

    await guildAlias.find(function (err, docs) {
        alias = {}
        if (docs.length == 0) {
            for (let [snowflake, GuildChannel] of message.guild.channels) {
                if (GuildChannel.type == "voice") {
                    alias[snowflake] = [GuildChannel.name.toLowerCase()];
                }
            }
        } else {
            aliasDict = docs[0].channels;
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


