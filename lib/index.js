var path = require("path");
const fs = require("fs");

const addDir = (filePath = "", object = {}) => {
  var dir = fs.readdirSync(__dirname + path.sep + filePath);
  dir.forEach(function (filename) {
    if (filename.endsWith(".js") && filename !== "index.js") {
      object[path.basename(filename).split(".")[0]] = require(path.join(
        __dirname + path.sep + filePath,
        filename
      ));
    } else if (
      fs.lstatSync(__dirname + path.sep + filePath + filename).isDirectory()
    ) {
      object[filename] = addDir(filePath + filename + path.sep);
    }
  });
  return object;
};

module.exports = addDir();
