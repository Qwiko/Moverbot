const helpMessage = require("../lib/helpMessage.js");

exports.run = async function(client, message) {
  //Check if administrator
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.channel.send(
      "You need to be an administrator to use this command."
    );
    return;
  }
  while (true) {
    messages = await message.channel.fetchMessages({
      limit: 100
    });
    if (messages.size == 0) break;
    await message.channel
      .bulkDelete(messages, true)
      .then(deletedMessages => {
        //Check if filter is needed or if bulkdelete deleted all messages.
        if (messages.size != deletedMessages.size) {
          //Filtering out messages that did not get deleted.
          messages = messages.filter(val => {
            !deletedMessages.array().includes(val);
          });
          if (messages.size > 0) {
            //Deleting messages older than 14 days
            messages.deleteAll();
          }
        }
      })
      //}
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
  }
  //After cleared print out the helpmessage again.
  helpMessage(client, message);
};

exports.help = {
  name: "clear",
  detail: "Clears this channel from messages.",
  aliases: ["c"]
};
