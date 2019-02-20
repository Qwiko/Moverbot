module.exports = function (message, alias) {
    aliasMessage = "";
    //Loop over json file with
    //channel.id as key: [array of aliases] as value
    for (key in alias) {
        //Find channel
        channel = message.guild.channels.find(val => val.id === key);
        //Shift removes channelname which is the first element.
        alias[key].shift()
        //Show only those who have aliases
        if (alias[key].length > 0) {
            //Channelname =
            aliasMessage += "**" + channel.name + "**" + " = "
            //Dont display the really long aliases.
            alias[key] = alias[key].filter(word => word.length < 7);
            //Loop over array of aliases
            alias[key].forEach(element => {
                //Add 
                aliasMessage += element + (alias[key].indexOf(element) < alias[key].length - 1 ? ', ' : '')
                //console.log(channelName)
            });
            //Newline when switching to another channel
            aliasMessage += "\n"
        }
    }
    //Check if the guild have aliases configured.
    if (aliasMessage.trim().length > 0) {
        message.channel.send({
            embed: {
                title: "Aliases",
                color: 0x43b581,
                description: aliasMessage
            }
        });
    } else {
        //No aliasMessage = no aliases.
        message.channel.send("You have no aliases configured.")
    }
}