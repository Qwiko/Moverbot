const fs = require("fs");

module.exports = function (message, client) {
    m = [];
    
    client.commands.forEach(cmd => {
        bool = false;
        //console.log(cmd.help);
        n = {
            name: client.config.prefix + cmd.help.name,
            value: cmd.help.usage
        }
        for (i = 0; i < m.length; i++) {
            if (m[i].name == n.name) {
                bool = true;
            }
        }
        if(!bool) {
            m.push(n)
        }
    });

    message.channel.send({embed: {
        title: "Commands to use the bot:",
        color: 0x43b581,
        //fields: m/*,
        description: fs.readFileSync("./files/helpMessage-eng.txt").toString()
        //*/
    }})
}