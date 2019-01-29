const fs = require("fs");

module.exports = function (message, client) {
    m = [];

    client.commands.forEach(cmd => {
        bool = false;
        //console.log(cmd.help);
        a = cmd.help.aliases;
        name = client.config.prefix + cmd.help.name;
        if (a.length >= 0) {
            a.forEach(alias => {
                name = name + "/" + client.config.prefix + alias;
            });
        }

        cmd.help.detail = cmd.help.detail.replace("${PREFIX}", client.config.prefix);

        n = {
            name: name,
            value: cmd.help.detail
        }
        for (i = 0; i < m.length; i++) {
            if (m[i].name == n.name) {
                bool = true;
            }
        }
        if (!bool) {
            m.push(n)
        }
    });

    message.channel.send({
        embed: {
            title: "Commands to use the bot:",
            color: 0x43b581,
            fields: m
            //description: fs.readFileSync("./files/helpMessage-eng.txt").toString()

        }
    })
}