//updateConfig
module.exports = function (client, message) {
  //Loop through and slice away channelname and id.
  //console.log(client.guild.config);

  for (a in client.guild.config.alias) {
    client.guild.config.alias[a] = client.guild.config.alias[a].slice(2);
    if (client.guild.config.alias[a].length == 0) {
      delete client.guild.config.alias[a];
    }
  }

  //Update mongodb.
  config = client.guild.config;

  //Set last updated tag
  config["last_updated"] = new Date().getTime();

  client.db.collection("config").replaceOne(
    { guild: message.guild.id },
    config,
    {
      upsert: true,
      w: 1,
    },
    function () {}
  );
};
