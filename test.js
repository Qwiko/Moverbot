var mongojs = require('mongojs')
var dbLogs = mongojs("mongodb://localhost:27017/logs")
var dbAlias = mongojs("mongodb://localhost:27017/alias")


var day = dbLogs.collection("791231279")





date = Math.floor(new Date())
log = { [date]: {
    "date":"asd",
    "time":"21.30",
    "user":"asd",
    "userid":"asd",
    "guild":"asd",
    "guildid":"asd",
    "content":"asd"
  }
}



day.update({date: "2018-11-09"}, {$set: log}, {upsert:true, w: 1}, function () {

})

dbLogs.close();