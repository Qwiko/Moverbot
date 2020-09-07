module.exports = function (client, message, response, server = false) {
  log = {
    author: {
      username: message.author.username,
      id: message.author.id,
    },
    content: message.content,
    timestamp: parseInt([new Date().getTime()]),
    guild: message.guild.id,
    response,
    serverlog: server,
  };

  //Server kan logga till server
  client.db.collection("logs").insert(log, function () {});
};
