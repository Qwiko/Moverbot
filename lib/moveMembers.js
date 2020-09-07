//moveMembers
module.exports = (client, oldChannel, newChannel) => {
  //client, message, oldChannel, newChannel
  var counter = 0;

  if (
    newChannel.userLimit != 0 &&
    newChannel.members.cache.size + oldChannel.members.cache.size >
      newChannel.userLimit
  ) {
    return false;
  }

  if (typeof oldChannel.user !== "undefined") {
    //Not a channel but a single user.
    oldChannel.voice.setChannel(newChannel).catch(console.error);
    counter = 1;
  } else {
    //Moving all members of a channel
    oldChannel.members.each((member) => {
      member.voice.setChannel(newChannel).catch((error) => {
        if (error.code == 40032) {
          //Target user is not connected to voice
          counter--;
        } else {
          console.log(error);
          console.log("Guild: " + newChannel.guild.id);
          console.log("Channel id: " + newChannel.id);
        }
      });
      counter++;
    });
  }

  client.lib.totalUsersMoved(client, counter);
  return counter;
};
