const tUM = require("../lib/tUM.js");

module.exports = function(client, oldChannel, newChannel) {
  var counter = 0;

  if (typeof oldChannel.user !== "undefined") {
    //Not a channel but a single user.
    //Move that one user instead
    oldChannel.setVoiceChannel(newChannel.id).catch(console.error);
    counter = 1;
  } else {
    //Moving all members of a channel
    oldChannel.members.forEach(member => {
      member.setVoiceChannel(newChannel.id).catch(console.error);
      counter++;
    });
  }

  tUM(client, counter);
  return counter;
};
