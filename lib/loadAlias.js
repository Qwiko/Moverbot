module.exports = async function (message, dbGuild, callback) {
    var guild = dbGuild.collection(message.guild.id);

    guild.findOne({
        _id: "aliases"
    }, function (err, doc) {
        alias = {}
        if (doc === null) {
            //If the guild does not have any aliases configured just send names of the channels.
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
        //console.log(alias);
        callback(alias)
    })
}