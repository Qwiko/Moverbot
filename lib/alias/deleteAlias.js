const updateAlias = require("./updateAlias.js");

module.exports = function (client, message, args, alias) {
  deletedArgs = [];
  //Try to delete all of the specified argument.
  args.forEach(arg => {
    for (a in alias) {
      var index = alias[a].indexOf(arg);
      //If found alias
      if (index > -1) {
        //Remove one element from index
        alias[a].splice(index, 1);
        deletedArgs.push(arg);
      }
    }
  })
  //Loop through and shift away channelname
  for (a in alias) {
    alias[a].shift();
    if (alias[a].length == 0) {
      delete alias[a];
    }
  }

  m = "Deleted alias" + (deletedArgs.length == 1 ? '' : 'es') + ": ";
  deletedArgs.forEach(a => {
    m = m + a + (deletedArgs.indexOf(a) < deletedArgs.length - 1 ? ', ' : '');
  });
  message.channel.send(m);

  //Update database
  updateAlias(client, message, alias);
}