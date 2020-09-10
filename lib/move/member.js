//move.member
module.exports = async (client, member, newChannel) => {
  //Move user to new channel

  movePromise = member.voice.setChannel(newChannel).catch((error) => {
    if (error.code == 40032) {
      //Target user is not connected to voice
      counter--;
    } else {
      console.log(error);
      console.log("Guild: " + newChannel.guild.id);
      console.log("Channel id: " + newChannel.id);
    }
  });
  return movePromise;
};
