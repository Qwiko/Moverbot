module.exports = function (client, message) {
  
  //console.log("Updating config for guild:", message.guild.name);
  //console.log(client.guild.config)
  //Loop through and shift away channelname
  for (a in client.guild.config.alias) {
    client.guild.config.alias[a].shift();
    if (client.guild.config.alias[a].length == 0) {
      delete client.guild.config.alias[a];
    }
  }
  //Update mongodb.
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