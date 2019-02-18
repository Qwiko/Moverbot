const tUM = require('../lib/tUM.js');

module.exports = (client) => {
    tUM(client, 0);
    console.log("Moverbot ready");
}