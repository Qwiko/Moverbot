//Load config
exports.loadConfig = async function(message, dbGuild, callback) {
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
      if (typeof config["channel"] === "undefined")
        config["channel"] = "moverbot";
      if (typeof config["aliasCommand"] === "undefined")
        config["aliasCommand"] = "move";

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

//updateConfig
exports.updateConfig = function(client, message) {
  //console.log("Updating config for guild:", message.guild.name);
  //console.log(client.guild.config)
  //Loop through and slice away channelname and id.
  for (a in client.guild.config.alias) {
    client.guild.config.alias[a] = client.guild.config.alias[a].slice(2);
    if (client.guild.config.alias[a].length == 0) {
      delete client.guild.config.alias[a];
    }
  }
  //Update mongodb.
  config = client.guild.config;
  client.dbGuild.collection(message.guild.id).update(
    {
      _id: "config"
    },
    {
      $set: {
        config
      }
    },
    {
      upsert: true,
      w: 1
    },
    function() {}
  );
};

//movemembers
exports.moveMembers = function(client, oldChannel, newChannel) {
  var counter = 0;

  if (typeof oldChannel.user !== "undefined") {
    //Not a channel but a single user.
    //Move that one user instead
    oldChannel.setVoiceChannel(newChannel.id).catch(console.error);
    counter = 1;
  } else {
    //Moving all members of a channel
    oldChannel.members.forEach(member => {
      member.setVoiceChannel(newChannel.id).catch(console.error);
      counter++;
    });
  }

  this.totalUsersMoved(client, counter);
  return counter;
};

//totalUsersMoved
exports.totalUsersMoved = function(client, amount) {
  var dbConfig = client.dbConfig.collection("server");
  //console.log(amount);
  dbConfig.findOne(
    {
      _id: "config"
    },
    function(err, doc) {
      usersMoved = doc.usersMoved + amount;
      client.user.setActivity(`Moved a total of ${usersMoved} users`);
      if (amount != 0) {
        dbConfig.update(
          {
            _id: "config"
          },
          {
            $set: {
              usersMoved: usersMoved
            }
          },
          {
            upsert: true,
            w: 1
          },
          function() {}
        );
      }
    }
  );
};

exports.log = function(
  client,
  authorUsername,
  authorId,
  guildId,
  log,
  db = "dbLogs"
) {
  logNew = {
    [new Date().getTime()]: {
      author: {
        username: authorUsername,
        id: authorId
      },
      content: log
    }
  };
  //console.log(logNew);
  client[db].collection(guildId).update(
    {
      _id: new Date().toISOString().slice(0, 10) //ex 2019-04-17
    },
    {
      $set: logNew
    },
    {
      upsert: true,
      w: 1
    },
    function() {}
  );
};
