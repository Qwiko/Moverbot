const helpMessage = require("../lib/helpMessage.js");

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

  await message.channel.bulkDelete(messages, true);
  
  // Get messages
  message.channel.fetchMessages({ limit: 100 })
  .then(messages => messages.deleteAll())
  .catch(console.error);

  //After cleared print out the helpmessage again.
  helpMessage(client, message);
};

exports.help = {
  name: "clear",
  detail: "Clears this channel from messages.",
  aliases: ["c"]
};
