//Load config
module.exports = async function (client, guild, callback) {
  client.db.collection("config").findOne(
    {
      guild: guild.id,
    },
    { _id: false },
    function (err, doc) {
      config = {};

      if (doc !== null) {
        //If there is data, take a copy
        config = { ...doc };
      } else {
        //Nothing found
        doc = { config: { alias: {} } };
      }
      //Setting default values
      //Prefix
      if (typeof config["prefix"] === "undefined") config["prefix"] = "!";

      //Language
      if (typeof config["language"] === "undefined") config["language"] = "EN";

      //Channel
      if (typeof config["channel"] === "undefined")
        config["channel"] = "moverbot";

      //Aliascommand
      if (typeof config["aliasCommand"] === "undefined")
        config["aliasCommand"] = "move";

      //Aliascommand
      if (typeof config["botMessages"] === "undefined")
        config["botMessages"] = false;

      if (typeof config["gamemove"] === "undefined")
        config["gamemove"] = { users: {}, roles: {} };

      //Setting guild id
      if (typeof config["guild"] === "undefined") {
        config["guild"] = guild.id;
      }

      //Check if user exists in the guild
      for (var id in config.gamemove.users) {
        member = guild.members.cache.find((member) => member.id === id);
        if (!member) {
          delete config.gamemove.users[id];
        }
      }
      //Check if roles exists in the guild
      for (var id in config.gamemove.roles) {
        role = guild.roles.cache.find((role) => role.id === id);
        if (!role) {
          delete config.gamemove.roles[id];
        }
      }

      //Clear aliases
      config.alias = {};
      //Set temporary aliases, id, name and position+1
      //This is done for all voicechannels.
      guild.channels.cache
        .filter((channel) => {
          return channel.type == "voice";
        })
        .sort((a, b) => {
          return a.position - b.position;
        })
        .forEach((channel) => {
          config.alias[channel.id] = [channel.name, channel.id];
        });
      //Add other aliases on top
      if (typeof doc.alias !== "undefined") {
        for (a in doc.alias) {
          if (
            typeof doc.alias[a] !== "undefined" &&
            typeof config.alias[a] !== "undefined"
          ) {
            config.alias[a] = config.alias[a].concat(doc.alias[a]);
          }
        }
      }
      callback(config);
    }
  );
};
