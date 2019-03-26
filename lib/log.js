module.exports = function(
  client,
  authorUsername,
  authorId,
  guildName,
  guildId,
  log,
  db = "dbLogs"
) {
  var today = new Date().toISOString().slice(0, 10);
  var time = new Date().toISOString().slice(11, 19);
  dateNum = Math.floor(new Date() / 1000);
  loge = {
    [dateNum]: {
      date: today,
      time: time,
      author: {
        username: authorUsername,
        id: authorId
      },
      guild: {
        name: guildName,
        id: guildId
      },
      content: log
    }
  };
  client[db].collection(guildId).update(
    {
      _id: today
    },
    {
      $set: loge
    },
    {
      upsert: true,
      w: 1
    },
    function() {}
  );
};
