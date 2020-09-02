module.exports = (client, error) => {
  console.log("ERROR");
  console.log(error);
  //Restarting when we have autorestarting pm2 or docker.
  process.exit(1);
};
