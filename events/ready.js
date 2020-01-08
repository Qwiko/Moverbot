const tools = require("../lib/tools.js");

module.exports = client => {
  tools.totalUsersMoved(client, 0);
  console.log("Moverbot ready");
};
