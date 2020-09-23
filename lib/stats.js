module.exports = async (client) => {
  //Fetching all guilds
  promises = client.shard.fetchClientValues("guilds.cache.size");
  totalGuildCount = (await promises).reduce(
    (acc, guildCount) => acc + guildCount,
    0
  );
  //console.log("Total Guild Count:", totalGuildCount);

  //totalGuilds
  newDoc = {
    totalGuilds: totalGuildCount,
    timestamp: parseInt([new Date().getTime()]),
  };
  //Inserting new document
  client.db.collection("server_totalguilds").insertOne(newDoc);
};
