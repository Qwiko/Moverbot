const helpMessage = require("../lib/helpMessage.js");

exports.run = async function(client, message) {
  //Check if administrator
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send(
      "You need to be an administrator to clear this channel."
    );
    return;
  }

  //Create a loop that checkes the channel for messages to delete more than 100 at a time.
  messages = await message.channel.fetchMessages({
    limit: 100
  });

  message.channel
    .bulkDelete(messages, true)
    .then(function(deletedMessages) {
      //Should be able to change this using filter instead.
      for (let [dsnowflake, dMessage] of deletedMessages) {
        for (let [snowflake, Message] of messages) {
          if (dMessage.id == Message.id) {
            messages.delete(snowflake);
          }
        }
      }
      if (messages.size != 0) {
        messages.forEach(mess => {
          mess.delete().catch(console.error);
        });
      }
    })
    .catch(function(error) {
      if (error.code == 50013) {
        console.log(error.code);
      } else if (error.code == 10008) {
        //Unknown Message
        console.log(error.code);
      } else {
        console.log(error);
      }
    });
  //After cleared print out the helpmessage again.
  helpMessage(client, message);
};

exports.help = {
  name: "clear",
  detail: "Clears this channel from messages.",
  aliases: ["c"]
};
