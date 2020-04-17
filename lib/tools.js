//Load config
exports.loadConfig = async function (client, guild, callback) {
  client.db.collection("config").findOne(
    {
      _id: guild.id,
    },
    function (err, doc) {
      config = {};

      if (doc !== null) {
        //If there is data, take a copy
        config = { ...doc };
        delete config["_id"];
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

      //Clear aliases
      config.alias = {};
      //Set temporary aliases, id, name and position+1
      //This is done for all voicechannels.
      guild.channels
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

//updateConfig
exports.updateConfig = function (client, message) {
  //Loop through and slice away channelname and id.
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

  client.db.collection("config").update(
    {
      _id: message.guild.id,
    },
    {
      $set: config,
    },
    {
      upsert: true,
      w: 1,
    },
    function () {}
  );
};

//moveMembers
exports.moveMembers = function (client, oldChannel, newChannel) {
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
    oldChannel.members.forEach((member) => {
      member.setVoiceChannel(newChannel.id).catch(console.error);
      counter++;
    });
  }

  this.totalUsersMoved(client, counter);
  return counter;
};

//totalUsersMoved
exports.totalUsersMoved = function (client, amount) {
  client.db.collection("config").findOne(
    {
      _id: "server",
    },
    function (err, doc) {
      if (doc === null) {
        usersMoved = amount;
      } else {
        usersMoved = doc.usersMoved + amount;
      }

      //client.user.setActivity(`Moved a total of ${usersMoved} users`);
      if (amount != 0) {
        client.db.collection("config").update(
          {
            _id: "server",
          },
          {
            $set: {
              usersMoved: usersMoved,
            },
          },
          {
            upsert: true,
            w: 1,
          },
          function () {}
        );
      }
    }
  );
};

exports.log = function (
  client,
  authorUsername,
  authorId,
  guildId,
  log,
  server = false
) {
  logNew = {
    [new Date().getTime()]: {
      author: {
        username: authorUsername,
        id: parseInt(authorId),
      },
      content: log,
      timestamp: parseInt([new Date().getTime()]),
    },
  };

  //Server kan logga till server
  client.db.collection("logs").update(
    {
      _id: server ? "server" : guildId, //document
    },
    {
      $set: logNew,
    },
    {
      upsert: true,
      w: 1,
    },
    function () {}
  );
};

exports.checkPermissions = function (client, channel) {
  return channel.guild.members
    .get(client.user.id)
    .permissionsIn(channel)
    .has("MOVE_MEMBERS");
};
