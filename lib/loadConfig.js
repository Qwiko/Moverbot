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
        callback(config);
    })
}