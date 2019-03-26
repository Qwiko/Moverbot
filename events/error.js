module.exports = (client, error) => {
  console.log("Websocket error(connection lost), Restarting");
  //Restarting when we have autorestarting pm2 or docker.
  process.exit(1);
};
