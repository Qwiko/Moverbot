var path = require("path"),
  dir = require("fs").readdirSync(__dirname + path.sep);

dir.forEach(function (filename) {
  if (filename !== "index.js") {
    var exportAsName = path.basename(filename).split(".")[0];
    module.exports[exportAsName] = require(path.join(__dirname, filename));
  }
});
