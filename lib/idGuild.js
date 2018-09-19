module.exports = function (message) {
  message.author.send('ID of channel: "' + message.guild.name + '" = ' + message.guild.id + '\n*This message will be deleted in 1 min*')
  .then(msg => {
    msg.delete(60000)
  })
  .catch(console.error);
  message.delete(10);
};
