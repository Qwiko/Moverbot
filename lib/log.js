var fs = require('fs');


module.exports = function (message, tried) {
  //<" + message.guild.name + ":" + message.guild.id + ">

  var dir = "logs/" + message.guild.id;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  m = getDateTime() + " " + message.author.username + ":" + message.author.id + "," + ' issued' + " the command: '" + message.content + "'"
  fs.appendFile("logs/" + message.guild.id + "/" + getDateTime(true) + ".txt", m + "\n", function(err) {
      if(err) {
          return console.log(err);
      }
  });





  //Debug
  //console.log(message.guild.id  + " " + m);
};



function getDateTime(onlyDate) {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    if (onlyDate == true) {
      return year + "-" + month + "-" + day;
    } else {
      return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    }
}
