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
    var { counter } = object;
    if (counter) object["users"] = "user" + (counter > 1 ? "s" : "");

    keys = Object.keys(object);
    keys.forEach((key) => {
      message = message.replace("{" + key + "}", object[key]);
    });
  }

  channel.send(message);

  response = {
    success: success,
    message: message,
    ...(counter && { usersmoved: counter }),
  };

  return response;
};
