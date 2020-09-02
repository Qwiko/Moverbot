//Load config
exports.loadConfig = async function (client, guild, callback) {
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

//updateConfig
exports.updateConfig = function (client, message) {
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

//moveMembers
exports.moveMembers = function (client, oldChannel, newChannel) {
  //client, message, oldChannel, newChannel
  var counter = 0;

  if (
    newChannel.userLimit != 0 &&
    newChannel.members.cache.size + oldChannel.members.cache.size >
      newChannel.userLimit
  ) {
    return false;
  }

  if (typeof oldChannel.user !== "undefined") {
    //Not a channel but a single user.
    oldChannel.voice.setChannel(newChannel).catch(console.error);
    counter = 1;
  } else {
    //Moving all members of a channel
    oldChannel.members.each((member) => {
      member.voice.setChannel(newChannel).catch((error) => {
        if (error.code == 40032) {
          //Target user is not connected to voice
          counter--;
        } else {
          console.log(error);
          console.log("Guild: " + newChannel.guild.id);
          console.log("Channel id: " + newChannel.id);
        }
      });
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
      guild: "server",
    },
    function (err, doc) {
      if (doc === null) {
        usersMoved = amount;
      } else {
        usersMoved = doc.usersMoved + amount;
      }

      //client.user.setActivity(`Moved a total of ${usersMoved} users`);
      if (amount != 0) {
        client.db.collection("config").replaceOne(
          {
            guild: "server",
          },
          {
            usersMoved: usersMoved,
            guild: "server",
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

exports.log = function (client, message, response, server = false) {
  log = {
    author: {
      username: message.author.username,
      id: message.author.id,
    },
    content: message.content,
    timestamp: parseInt([new Date().getTime()]),
    guild: message.guild.id,
    response,
    serverlog: server,
  };

  //Server kan logga till server
  console.log(log);
  //client.db.collection("logs").insert(log, function () {});
};

exports.checkPermissions = function (client, channel) {
  return channel.guild.members.cache
    .get(client.user.id)
    .permissionsIn(channel)
    .has("MOVE_MEMBERS");
};
