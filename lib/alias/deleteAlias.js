const tools = require("../tools.js");

module.exports = function (client, message, args) {
  deletedArgs = [];
  args.shift();
  //Try to delete all of the specified argument.
  args.forEach((arg) => {
    for (a in client.guild.config.alias) {
      var index = client.guild.config.alias[a].indexOf(arg);
      //If found client.guild.config.alias
      if (index > -1) {
        //Remove one element from index
        client.guild.config.alias[a].splice(index, 1);
        deletedArgs.push(arg);
      }
      //Try to delete if it was hidden
      if (typeof client.guild.config.hidden != "undefined") {
        var hiddenIndex = client.guild.config.hidden.indexOf(arg);
        if (hiddenIndex > -1) {
          //Remove one element from index
          client.guild.config.hidden.splice(index, 1);
        }
      }
    }
  });

  if (deletedArgs.length == 0) {
    message.channel.send("Could not delete alias, is it configured?");
    return;
  }

  m = "Deleted alias" + (deletedArgs.length == 1 ? "" : "es") + ": ";
  deletedArgs.forEach((a) => {
    m = m + a + (deletedArgs.indexOf(a) < deletedArgs.length - 1 ? ", " : "");
  });
  m = m + ".";
  message.channel.send(m);
  //Update database
  tools.updateConfig(client, message);
};
