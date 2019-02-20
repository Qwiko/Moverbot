module.exports = function (client, message, alias) {
    const aliasColl = client.dbGuild.collection(message.guild.id);
    c = {
        "channels": alias
    }
    //Update mongodb.
    console.log("Updating alias for guild:", message.guild.name);
    console.log(c)
    aliasColl.update({
      _id: "aliases"
    }, {
      $set: c
    }, {
      upsert: true,
      w: 1
    }, function () {})
}