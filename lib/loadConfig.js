module.exports = async function (message, dbAlias, callback) {
    var guild = dbAlias.collection(message.guild.id);

    guild.findOne({_id: "config"}, function(err, doc) {
        console.log(doc)
        config = {}
        if (doc === null) {
            config["prefix"] = "!"
        } else {
            config = doc.config
        }
        callback(alias)
    })
}


