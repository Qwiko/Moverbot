
module.exports = function (message, dict) {
  if(dict.length != 0) {
    var values = Object.values(dict)
    var keys = Object.keys(dict);
    var m = "Current aliases:\n"
    for (i in values) {
      if (values[i].length > 0) {
          m += "**" + keys[i] + "**" + " = "
          values[i].sort()
        for (j in values[i]) {
          m += values[i][j] + (j < values[i].length-1 ? ', ' : '')
        }
        m += "\n"
      }
    }
    message.channel.send(m)
  } else {
    message.channel.send("There are no aliases yet.")
  }
};
