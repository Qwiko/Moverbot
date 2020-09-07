//totalUsersMoved
module.exports = function (client, amount) {
  if (amount == 0) {
    return;
  }

  client.db
    .collection("server_usersmoved")
    .find()
    .sort({ timestamp: -1 }, function (err, docs) {
      doc = docs[0];
      if (doc === null) {
        usersMoved = amount;
      } else {
        usersMoved = doc.usersMoved + amount;
      }
      //Server kan logga till server

      client.db.collection("server_usersmoved").insert(
        {
          totalUsersMoved: usersMoved,
          usersmoved: amount,
          timestamp: parseInt([new Date().getTime()]),
        },
        function () {}
      );
    });
};
