const fs = require("fs");

exports.run = async function (client, message) {

  messages = await message.channel.fetchMessages({ limit: 100 })

  message.channel.bulkDelete(messages, true)
    .then(function(deletedMessages) {
      for (let [dsnowflake, dMessage] of deletedMessages) {
        for (let [snowflake, Message] of messages) {
          if (dMessage.id == Message.id){
            messages.delete(snowflake)
          }
        }
      };
      //console.log(messages.size);
      if (messages.size != 0){
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
    .catch(function(error) {
      if (error.code == 50013){
        console.log(error);
      } else {
        console.log(error);
      }
    });
  message.channel.send({embed: {
      color: 0x43b581,
      description: fs.readFileSync("./files/helpMessage-eng.txt").toString()
  }});
}

exports.help = {
  name: "clear",
  usage: "!clear",
  aliases: ["c"]
}