module.exports = (client, guild) => {
  console.log("Joined a new guild: " + guild.name);

  //console.log(guild.owner.user.username);
  guild.owner.send(
    "Hello " +
      guild.owner.user.username +
      ", owner of " +
      guild.name +
      ".\nPlease create a textchannel named moverbot and write !help to start using Moverbot!\nAutomation of this process is being developed."
  );
};
