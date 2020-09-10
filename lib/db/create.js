const MongoClient = require("mongodb").MongoClient;

module.exports = async (client) => {
  const url = client.config.serverip + client.config.options;
  mclient = await MongoClient.connect(url, { useUnifiedTopology: true });

  client.db = await mclient.db(client.config.db);
};
