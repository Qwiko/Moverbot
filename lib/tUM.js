//Total Users Moved.

module.exports = function(client, amount) {
  var dbConfig = client.dbConfig.collection("server");
  //console.log(amount);
  dbConfig.findOne(
    {
      _id: "config"
    },
    function(err, doc) {
      usersMoved = doc.usersMoved + amount;
      client.user.setActivity(`Moved a total of ${usersMoved} users`);
      if (amount != 0) {
        dbConfig.update(
          {
            _id: "config"
          },
          {
            $set: {
              usersMoved: usersMoved
            }
          },
          {
            upsert: true,
            w: 1
          },
          function() {}
        );
      }
    }
  );
};
