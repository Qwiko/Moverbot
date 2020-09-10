//totalUsersMoved
module.exports = async (client, amount) => {
  if (!amount) {
    return;
  }
  doc = await client.db
    .collection("server_usersmoved")
    .findOne({}, { sort: { timestamp: -1 } });

  if (doc) {
    totalUsersMoved = doc.totalUsersMoved;
  } else {
    totalUsersMoved = 0;
  }
  totalUsersMoved += amount;

  newDoc = {
    totalUsersMoved: totalUsersMoved,
    usersmoved: amount,
    timestamp: parseInt([new Date().getTime()]),
  };

  client.db.collection("server_usersmoved").insertOne(newDoc);
};
