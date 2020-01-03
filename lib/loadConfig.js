module.exports = async function(message, dbGuild, callback) {
  var guild = dbGuild.collection(message.guild.id);
  guild.findOne(
    {
      _id: "config"
    },
    function(err, doc) {
      config = {};
      if (doc === null) {
        config["prefix"] = "!";
      } else {
        config = doc.config;
      }
      
      //Setting default values if none are present.
      if (typeof config["channel"] === "undefined") config["channel"] = "moverbot";
      if (typeof config["aliasCommand"] === "undefined") config["aliasCommand"] = "move";

      //Setting default aliases if there are not configured
      if (typeof config.alias === "undefined") {
        config.alias = {};
        //If the guild does not have any aliases configured just send names and ids of the channels.
        message.guild.channels.forEach(GuildChannel => {
          if (GuildChannel.type == "voice") {
            config.alias[GuildChannel.id] = [
              GuildChannel.name,
              GuildChannel.id
            ];
          }
        });
      //Alias are configured. Load them in.
      } else {
        ordered = {};
        Object.keys(config.alias)
          .sort()
          .forEach(function(key) {
            ordered[key] = config.alias[key];
          });
        config.alias = ordered;

        aliasDict = config.alias;
        message.guild.channels.forEach(GuildChannel => {
          snowflake = GuildChannel.id;
          if (GuildChannel.type == "voice") {
            if (typeof aliasDict[snowflake] !== "undefined") {
              config.alias[snowflake] = aliasDict[snowflake];
              config.alias[snowflake].unshift(
                GuildChannel.name,
                GuildChannel.id
              );
            } else {
              config.alias[snowflake] = [GuildChannel.name, GuildChannel.id];
            }
          }
        });
      }
      callback(config);
    }
  );
};
