exports.run = async (bot, message, interaction, args) => {

    //Prints out the helpmessage for the user.
    m = [];

    client.commands.each((cmd) => {
        bool = false;
        //console.log(cmd.help);
        a = cmd.help.aliases;
        prefix = "!"
        name = prefix + cmd.help.name;
        if (a.length >= 0) {
            a.forEach((alias) => {
                name = name + "/" + prefix + alias;
            });
        }
        cmd.help.detail = cmd.help.detail
            .split("${PREFIX}")
            .join(prefix);
        n = {
            name: name,
            value: cmd.help.detail,
        };
        for (i = 0; i < m.length; i++) {
            if (m[i].name == n.name) {
                bool = true;
            }
        }
        if (!bool) {
            m.push(n);
        }
    });
    await bot.lib.message.send(
        bot,
        message,
        interaction,
        {
            embed: {
                footer: {
                    text: "Wiki page: https://github.com/Qwiko/Moverbot/wiki",
                },
                title: "Commands to use the bot:",
                color: 0x43b581,
                fields: m,
            },
        }
    );
};

exports.help = {
    name: "help",
    detail: "Shows this help-message.",
    enabled: true,
    aliases: ["h"],
};