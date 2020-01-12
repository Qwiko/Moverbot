//Load config
exports.loadConfig = async function(message, dbGuild, callback) {
  var guild = dbGuild.collection(message.guild.id);
  guild.findOne(
    {
      _id: "config"
    },
    function(err, doc) {
      config = {};

      if (doc !== null) {
        //If there is data, take a copy
        config = { ...doc.config };
      } else {
        //Nothing found
        doc = { config: { alias: {} } };
      }
      //Setting default values
      //Prefix
      if (typeof config["prefix"] === "undefined") config["prefix"] = "!";

      //Channel
      if (typeof config["channel"] === "undefined")
        config["channel"] = "moverbot";

      //Aliascommand
      if (typeof config["aliasCommand"] === "undefined")
        config["aliasCommand"] = "move";

      //Clear aliases
      config.alias = {};
      //Set temporary aliases, id, name and position+1
      //This is done for all voicechannels.
      message.guild.channels
        .filter(channel => {
          return channel.type == "voice";
        })
        .sort((a, b) => {
          return a.position - b.position;
        })
        .forEach(channel => {
          config.alias[channel.id] = [channel.name, channel.id];
        });
      //Add other aliases on top
      if (typeof doc.config.alias !== "undefined") {
        for (a in doc.config.alias) {
          if (
            typeof doc.config.alias[a] !== "undefined" &&
            typeof config.alias[a] !== "undefined"
          ) {
            config.alias[a] = config.alias[a].concat(doc.config.alias[a]);
          }
        }
      }
      callback(config);
    }
  );
};

//updateConfig
exports.updateConfig = function(client, message) {
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

//moveMembers
exports.moveMembers = function(client, oldChannel, newChannel) {
  //client, message, oldChannel, newChannel
  var counter = 0;

  if (
    newChannel.userLimit != 0 &&
    newChannel.members.size + oldChannel.members.size > newChannel.userLimit
  ) {
    return false;
  }

  if (typeof oldChannel.user !== "undefined") {
    //Not a channel but a single user.
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
