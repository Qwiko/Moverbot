module.exports = function (message) {
  message.author.send('ID of channel: "' + message.guild.name + '" = ' + message.guild.id + '\n*This message will be deleted in 10 sec*')
  .then(msg => {
    msg.delete(10000)
  })
  .catch(console.error);
  message.delete(1);
};
