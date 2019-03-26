exports.run = function(client, message, args) {
  good_prefixes = ["!", ".", ",", ":", ";", "!!", "..", "--", "-"];

  //Check if administrator
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send("You need to be an administrator to change prefix.");
    return;
  }

  if (typeof args[0] == "undefined") {
    message.channel.send("Please provide a prefix.");
    return;
  }

  if (args[0].length > 2 || args[0].length == 0) {
    message.channel.send("Your new prefix can maximum be 2 characters.");
    return;
  }

  if (!good_prefixes.includes(args[0])) {
    mes = "Your new prefix must be one of the following\n";
    good_prefixes.forEach(element => {
      mes = mes + element + " ";
    });
    message.channel.send(mes);
    return;
  }

  //Check if it is the same prefix.
  if (client.guild.config.prefix == args[0]) {
    message.channel.send("You already have that prefix set.");
    return;
  }

  config = client.guild.config;
  config.prefix = args[0];

  message.channel.send("Changed prefix to: " + args[0]);
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

exports.help = {
  name: "prefix",
  detail: "Change prefix for moverbot with: ${PREFIX}prefix NEW_PREFIX.",
  aliases: []
};
