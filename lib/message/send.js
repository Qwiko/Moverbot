module.exports = async (client, channel, identifier, object = {}) => {
  //Object
  //counter
  //oldChannelName
  //newChannelName

  language = client.guild.config.language;

  var { message, success } = await client.lib.message.get(
    client,
    language,
    identifier
  );

  //Parsing object
  if (object) {
    var { counter } = { ...object }; //Copy
    if (counter) object["users"] = "user" + (counter > 1 ? "s" : "");

    keys = Object.keys(object);
    keys.forEach((key) => {
      message = message.replace("{" + key + "}", object[key]);
    });
    delete object["user"];
    delete object["users"];
    delete object["counter"];
  }

  channel.send(message);

  response = {
    success: success,
    command: client.cmd.help.name,
    identifier: identifier,
    ...(counter && { usersmoved: counter }),
    ...(object && { ...object }),
  };

  return response;
};
