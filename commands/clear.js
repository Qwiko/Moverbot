exports.run = async (client, message) => {
  if (message.webhookID) {
    return client.lib.message.send(client, message.channel, "CANNOT_WEBHOOK");
  }

  //Check if administrator
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send(
      "You need to be an administrator to use this command."
    );
    return {
      success: false,
      message: "You need to be an administrator to use this command.",
    };
  }

  messages = await message.channel.fetchMessages({ limit: 100 });
  //No messages in the channel, do not have to delete anything

  await message.channel.bulkDelete(messages, true).catch(function (error) {
    //console.log("bulk");
    //console.log(error);
  });

  // Get messages
  await message.channel
    .fetchMessages({ limit: 100 })
    .then((messages) => messages.deleteAll())
    .catch((error) => {
      //console.log("single");
      //console.log(error);
    });
  return {
    success: true,
    message: "Cleared textchannel of messages",
  };
};

exports.help = {
  name: "clear",
  detail: "Clears this channel from messages.",
  enabled: false,
  aliases: ["c"],
};
