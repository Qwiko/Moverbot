module.exports = function(
  client,
  authorUsername,
  authorId,
  guildId,
  log,
  db = "dbLogs"
) {
  logNew = {
    [new Date().getTime()]: {
      author: {
        username: authorUsername,
        id: authorId
      },
      content: log
    }
  };
  //console.log(logNew);
  client[db].collection(guildId).update(
    {
      _id: new Date().toISOString().slice(0, 10) //ex 2019-04-17
    },
    {
      $set: logNew
    },
    {
      upsert: true,
      w: 1
    },
    function() {}
  );
};
