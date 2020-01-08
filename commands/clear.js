exports.run = async function(client, message) {
  //Check if administrator
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send(
      "You need to be an administrator to use this command."
    );
    return;
  }

  messages = await message.channel.fetchMessages({ limit: 100 });
  //No messages in the channel, do not have to delete anything

  await message.channel.bulkDelete(messages, true).catch(function(error) {
    /* Handle error here for browser new page and return
       expected value for page if things fail */
    console.log("bulk");
    console.log(error);
  });

  // Get messages
  await message.channel
    .fetchMessages({ limit: 100 })
    .then(messages => messages.deleteAll())
    .catch(error => {
      console.log("single");
      console.log(error);
    });

  //After cleared print out the helpmessage again.
  //helpMessage(client, message);
};

exports.help = {
  name: "clear",
  detail: "Clears this channel from messages.",
  aliases: ["c"]
};
