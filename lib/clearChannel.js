const fs = require("fs");

module.exports = async function (message) {
  message.delete();
  const fetched = await message.channel.fetchMessages({limit: 99});
  message.channel.bulkDelete(fetched);
  message.channel.send(fs.readFileSync("./files/helpMessage-eng.txt").toString())
};


/*TODO
Fix when deleting old messages.
*/
