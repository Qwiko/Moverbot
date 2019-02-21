module.exports = function (client, message) {
  //Update mongodb.
  //console.log("Updating config for guild:", message.guild.name);
  //console.log(client.guild.config)
  config = client.guild.config;
  client.dbGuild.collection(message.guild.id).update({
      _id: "config"
    }, {
      $set: {
        config
      }
    }, {
      upsert: true,
      w: 1
    },
    function () {

    });
}