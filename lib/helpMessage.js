const fs = require("fs");

module.exports = function (message, client) {
    message.channel.send({embed: {
        title: "Commands to use the bot:",
        color: 0x43b581,
        description: fs.readFileSync("./files/helpMessage-eng.txt").toString()
    }})
}