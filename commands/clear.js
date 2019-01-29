const helpMessage = require('../lib/helpMessage.js');

exports.run = async function (client, message) {

  messages = await message.channel.fetchMessages({
    limit: 100
  })

  message.channel.bulkDelete(messages, true)
    .then(function (deletedMessages) {
      for (let [dsnowflake, dMessage] of deletedMessages) {
        for (let [snowflake, Message] of messages) {
          if (dMessage.id == Message.id) {
            messages.delete(snowflake)
          }
        }
      };
      //console.log(messages.size);
      if (messages.size != 0) {
        messages.forEach(mess => {
          mess.delete()
            .catch(console.error);
        })
        /*for (let [snowflake, Message] of messages) {
          Message.delete()
            .catch(console.error);
        }*/
      }
    })
    .catch(function (error) {
      if (error.code == 50013) {
        console.log(error.code);
      } else if (error.code == 10008) { //Unknown Message
        console.log(error.code);
      } else {
        console.log(error);
      }
    });
  //After cleared print out the helpmessage again.
  helpMessage(message, client);
}

exports.help = {
  name: "clear",
  detail: "Clears this channel from messages.",
  aliases: ["c"]
}