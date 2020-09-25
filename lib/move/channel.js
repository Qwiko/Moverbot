//move.channel
//main move function

module.exports = async (client, oldChannel, newChannel) => {
  if (
    newChannel.userLimit != 0 &&
    newChannel.members.size +
      (typeof oldChannel.user !== "undefined" ? 1 : oldChannel.members.size) >
      newChannel.userLimit
  ) {
    return 0; //No users can be moved
  }
  movePromises = [];

  if (typeof oldChannel.user !== "undefined") {
    //Not a channel but a single user.
    movePromises.push(client.lib.move.member(client, oldChannel, newChannel));
  } else {
    //Moving all members of a channel
    oldChannel.members.each((member) => {
      movePromises.push(client.lib.move.member(client, member, newChannel));
    });
  }

  //Await all pending move promises before we write
  //Counting every fulfilled promise. The correct move amount
  var counter = (await Promise.allSettled(movePromises)).filter(
    (promise) => promise.status == "fulfilled"
  ).length;

  //Set new totalUsersValue
  client.lib.totalUsersMoved(client, counter);

  return counter;
};
