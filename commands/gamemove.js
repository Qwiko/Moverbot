exports.run = async (client, message, args) => {
  alias = client.guild.config.alias;

  if (message.webhookID) {
    return client.lib.message.send(client, message.channel, "CANNOT_WEBHOOK");
  }

  //If only !gamemove is sent, display current settings
  if (args[0] == "display") {
    //console.log(client.guild.config.users);
    if (
      !(
        Object.keys(client.guild.config.gamemove.users).length +
        Object.keys(client.guild.config.gamemove.roles).length
      )
    ) {
      message.channel.send("No gamemove settings found.");
    } else {
      msg = "";
      Object.keys(client.guild.config.gamemove.users).forEach((user) => {
        //console.log(message.guild.members);
        msg += message.guild.members.cache.find((val) => val.id === user).user
          .username;
        msg += ": ";
        Object.keys(client.guild.config.gamemove.users[user]).forEach((key) => {
          msg += key + ": " + client.guild.config.gamemove.users[user][key];
          msg += " ";
        });
        msg += "\n";
      });
      Object.keys(client.guild.config.gamemove.roles).forEach((role) => {
        //console.log(message.guild.members);
        msg += message.guild.roles.cache.find((val) => val.id === role).name;
        msg += ": ";
        Object.keys(client.guild.config.gamemove.roles[role]).forEach((key) => {
          msg += key + ": " + client.guild.config.gamemove.roles[role][key];
          msg += " ";
        });
        msg += "\n";
      });
      message.channel.send({
        embed: {
          title: "Gamemove settings",
          color: 0x43b581,
          description: msg,
        },
      });
    }

    return {
      success: true,
      message: "Displayed gamemove settings.",
    };
  }

  //If only gamemove is sent with no mentions
  if (
    args.length == 0 ||
    !(
      ["on", "off"].includes(args[0]) &&
      (message.mentions.users.array().length +
        message.mentions.roles.array().length ||
        message.mentions.everyone)
    )
  ) {
    message.channel.send(
      "Usage: " +
        client.guild.config.prefix +
        "gamemove on/off @mention, to display run: " +
        client.guild.config.prefix +
        "gamemove display."
    );
    return {
      success: false,
      message: "Wrong usage.",
    };
  }
  if (message.mentions.roles.array().length) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send(
        "<@" +
          message.author.id +
          ">, you need to be an administrator to mention roles."
      );
      return {
        success: false,
        message: "Not an admin and mentioned a role.",
      };
    }
  }

  messageBot = false;
  message.mentions.users.each((user) => {
    if (user.bot) {
      messageBot = true;
    }
  });

  if (messageBot) {
    message.channel.send("You cannot mention bots.");
    return {
      success: false,
      message: "Mentioned bot account.",
    };
  }

  if (message.mentions.users.array().length) {
    user = message.mentions.users.find((user) => user == message.author);
    if (!user) {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send(
          "<@" +
            message.author.id +
            ">, you need to be an administrator to mention other users."
        );
        return {
          success: false,
          message: "Not an admin and mentioned other users.",
        };
      }
    }
  }

  if (message.mentions.everyone) {
    //Recieved everyone mention

    //Instantly delete the message to remove spam
    message.delete();

    //Check if administrator
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send(
        "<@" +
          message.author.id +
          ">, you need to be an administrator to run this command."
      );
      return {
        success: false,
        message: "Mentioned everyone without being an admin.",
      };
    }

    if (args[0] == "on") {
      message.channel.send(
        "<@" +
          message.author.id +
          ">, it is not possible to enable gamemove for everyone."
      );

      return {
        success: false,
        message: "Mentioned on with everyone mention.",
      };
    } else if (args[0] == "off") {
      message.channel.send(
        "<@" + message.author.id + ">, disabled gamemove for everyone."
      );
      client.guild.config.gamemove.users = {};
      client.guild.config.gamemove.roles = {};
      //console.log(client.guild.gamemove.config);
      client.lib.db.updateConfig(client, message);
      return {
        success: true,
        message: "Mentioned off with everyone mention.",
      };
    }
  }

  if (args[0] == "on") {
    enabled = true;
  } else if (args[0] == "off") {
    enabled = false;
  }
  if (args.includes("drag") && enabled) {
    drag = true;
  } else {
    drag = false;
  }

  //console.log(message.mentions);
  names = [];
  message.mentions.users.forEach((user) => {
    client.guild.config.gamemove.users[user.id] = {
      enabled: enabled,
      drag: drag,
    };
    names.push(user.username);
  });

  message.mentions.roles.forEach((role) => {
    client.guild.config.gamemove.roles[role.id] = {
      enabled: enabled,
      drag: drag,
    };
    names.push(role.name);
  });

  m = "Turning " + args[0] + " automatic moving for: ";

  //console.log(client.guild.config.gamemove);
  //return;
  for (var name of names) {
    m += name;
    if (name != names[names.length - 1]) {
      m += ", ";
    } else {
      if (drag) {
        m += " with drag.";
      } else {
        m += ".";
      }
    }
  }

  message.channel.send(m);

  //Updating config
  client.lib.db.updateConfig(client, message);
  return {
    success: true,
    message: m,
  };
};

exports.help = {
  name: "gamemove",
  detail:
    "Enable or disable automatic moving depending on your game with ${PREFIX}gamemove on/off, optional argument: 'drag', drags with all users from your channel when you switch game.",
  enabled: true,
  aliases: ["gm"],
};
