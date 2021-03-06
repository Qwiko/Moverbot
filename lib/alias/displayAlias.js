module.exports = async (client, message, arg) => {
  alias = client.guild.config.alias;
  aliasMessage = "";
  //Loop over json file with
  //channel.id as key: [array of aliases] as value
  for (key in client.guild.config.alias) {
    //Find channel
    channel = message.guild.channels.cache.find((val) => val.id === key);
    //Slice removes channelname and id which are the first two elements.
    client.guild.config.alias[key] = client.guild.config.alias[key].slice(2);

    //Filter away hidden aliases
    if (!arg) {
      //Remove alias if in hidden array
      client.guild.config.alias[key] = client.guild.config.alias[key].filter(
        (word) => {
          if (client.guild.config.hidden != null) {
            return !client.guild.config.hidden.includes(word);
          } else {
            return true;
          }
        }
      );
    }
    //Show only those who have aliases
    if (client.guild.config.alias[key].length > 0) {
      //Channelname =
      aliasMessage += "**" + channel.name + "**" + " = ";
      //Loop over array of aliases
      client.guild.config.alias[key].forEach((element) => {
        //Add
        aliasMessage +=
          element +
          (client.guild.config.alias[key].indexOf(element) <
          client.guild.config.alias[key].length - 1
            ? ", "
            : "");
        //console.log(channelName)
      });
      //Newline when switching to another channel
      aliasMessage += "\n";
    }
  }
  //Check if the guild have aliases configured.
  if (aliasMessage.trim().length > 0) {
    message.channel.send({
      embed: {
        title: "Aliases",
        color: 0x43b581,
        description: aliasMessage,
      },
    });
    return {
      success: true,
      message: "Displayed alias correctly",
    };
  } else {
    //No aliasMessage = no aliases.
    message.channel.send("You have no aliases configured.");
    return {
      success: true,
      message: "You have no aliases configured.",
    };
  }
};
