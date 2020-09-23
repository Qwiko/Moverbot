const MongoClient = require("mongodb").MongoClient;

module.exports = async (client) => {
  const url = client.config.serverip + client.config.options;
  mclient = await MongoClient(url, { useUnifiedTopology: true });

  mclient.on("serverClosed", (event) => {
    console.log(JSON.stringify(event, null, 2));
    console.log("Restarting");
    process.exit(1);
  });

  await mclient.connect();

  client.db = await mclient.db(client.config.db);
};
