module.exports = function (message, dbLogs) {

  var guildCollection = dbLogs.collection(message.guild.id)
  today = getYear() + "-" + getMonth() + "-" + getDate();
  time = getHours() + ":" + getMinutes() + ":" + getSeconds()
  dateNum = Math.floor(new Date() / 1000)
  log = {
    [dateNum]: {
      "date": today,
      "time": time,
      "author.username": message.author.username,
      "author.id": message.author.id,
      "guild.name": message.guild.name,
      "guild.id": message.guild.id,
      "content": message.content
    }
  }
  //console.log(message.author.username + ":" + message.guild.name + ", " + log[dateNum].content);
  guildCollection.update({
    _id: today
  }, {
    $set: log
  }, {
    upsert: true,
    w: 1
  }, function () {})
};


var date = new Date();

function getHours() {
  return (date.getHours() < 10 ? "0" : "") + date.getHours();
}

function getMinutes() {
  return (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
}

function getSeconds() {
  return (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
}

function getYear() {
  return date.getFullYear();
}

function getMonth() {
  var month = date.getMonth() + 1;
  return (month < 10 ? "0" : "") + month;
}

function getDate() {
  return (date.getDate() < 10 ? "0" : "") + date.getDate();
}