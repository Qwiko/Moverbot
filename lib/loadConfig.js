module.exports = async function (message, dbGuild, callback) {
    var guild = dbGuild.collection(message.guild.id);
    guild.findOne({
        _id: "config"
    }, function (err, doc) {
        config = {};
        if (doc === null) {
            config["prefix"] = "!";
        } else {
            config = doc.config;
        }

        if (typeof config.alias === "undefined") {
            config.alias = {}
            //If the guild does not have any aliases configured just send names of the channels.
            message.guild.channels.forEach(GuildChannel => {
                if (GuildChannel.type == "voice") {
                    config.alias[GuildChannel.id] = [GuildChannel.name.toLowerCase()];
                }
            })
        } else {
            ordered = {}
            Object.keys(config.alias).sort().forEach(function (key) {
                ordered[key] = config.alias[key];
            });
            config.alias = ordered;


            aliasDict = config.alias;
            message.guild.channels.forEach(GuildChannel => {
                snowflake = GuildChannel.id;
                if (GuildChannel.type == "voice") {
                    if (typeof aliasDict[snowflake] !== "undefined") {
                        config.alias[snowflake] = aliasDict[snowflake]
                        config.alias[snowflake].unshift(GuildChannel.name.toLowerCase())
                    } else {
                        config.alias[snowflake] = [GuildChannel.name.toLowerCase()]
                    }
                }
            });
        }

        //console.log(config);

        callback(config);
    })
}