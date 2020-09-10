exports.run = async (client, message, args) => {
  alias = client.guild.config.alias;
  newChannel = undefined;

  //Gathers all users to your voicechannel.
  if (args.length > 0) {
    //Try and find the channelID from the arg
    for (var key in alias) {
      if (alias[key].includes(args[0])) {
        newChannel = message.guild.channels.cache.find((val) => val.id === key);
        break;
        //&& val.type == "voice"
      }
    }
  } else {
    newChannel = message.member.voice.channel;
  }
  if (!message.webhookID) {
    //Todo fix for webhooks
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send(
        "You need to be an administrator to use this command."
      );
      return {
        success: false,
        message: "You need to be an administrator to use this command.",
      };
    }
  }
  //You need to be a part of a channel.
  if (typeof newChannel === "undefined") {
    message.channel.send(
      "You are not part of a voicechannel or supplied a valid destination."
    );
    return {
      success: false,
      message:
        "You are not part of a voicechannel or supplied a valid destination.",
    };
  }

  //Find all voicechannels without the one we are in.
  allVoice = message.guild.channels.cache.filter((val) => {
    //message.channel
    //console.log(val);
    return (
      val.type == "voice" &&
      val.id != newChannel.id &&
      client.lib.checkPermissions(client, val) &&
      val.members.size != 0
    );
  });
  //Check if there are any members that can be moved. If the guild are empty exept for you.

  if (!allVoice.size) {
    message.channel.send("There are no users that can be moved.");
    return {
      success: false,
      message: "There are no users that can be moved.",
    };
  }

  promises = [];
  allVoice.each((channel) => {
    promises.push(client.lib.move.channel(client, channel, newChannel));
  });

  counter = (await Promise.all(promises)).reduce((acc, cur) => acc + cur);

  if (!counter) {
    message.channel.send("Something went wrong, could not move anyone.");
    return {
      success: false,
      message: "Something went wrong, could not move anyone.",
    };
  }

  message.channel.send(
    "Gathered " +
      counter +
      (counter == 1 ? " user" : " users") +
      " to channel: *" +
      newChannel.name +
      "*."
  );
  return {
    success: true,
    message:
      "Gathered " +
      counter +
      (counter == 1 ? " user" : " users") +
      " to channel: *" +
      newChannel.name +
      "*.",
    usersmoved: counter,
  };
};

exports.help = {
  name: "gather",
  detail:
    "Gathers all users from all channels to your channel with: ${PREFIX}gather. Optional you can send with ${PREFIX}gather CHANNELNAME",
  enabled: true,
  aliases: [],
};
