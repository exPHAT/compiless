var fs   = require("fs");
var path = require("path");
var less = require("less");

/*
 * The main module itself
 * @param {String} startPath     The path that all data is relative to (generally __dirname)
 * @param {Object} toMove        The directories to be explored and exported
 * @param {Object} opts          An optional argument of options to be used
 * @param {Integer} opts.depth   How deep the recursive search should go
 */
module.exports = function(startPath, toMove, opts) {

  /*
   * Determine if a path is a directory
   * @param {String} pth  Tthe absolute path to the possible directory
   * @returns {Boolean} If the specified path is a directory
   */
  function isDir(pth) {
    return fs.existsSync(pth) && fs.lstatSync(pth).isDirectory();
  }

  /*
   * The main recursive function that explores directories
   * @param {String} pth    the directory to explore
   * @param {Array} list    the current list of found files
   */
  function explore(pth, list) {
    // Store for later
    dirsToCreate.push(pth);

    var contents = fs.readdirSync(pth);
    contents.forEach(function(item) {
      var itemPath = path.join(pth, item);

      if (isDir(itemPath)) {
        explore(itemPath, list);
      }
      else {
        list.push(itemPath);
      }
    });

    return list;
  }

  // Ensure module was used properly
  if (opts === undefined) {
    opts = {};
  }

  if (startPath !== undefined && startPath.constructor === String) {
    throw new Error("Expected startPath to be a string.");
  }

  if (toMove !== undefined && toMove.constructor !== Object) {
    throw new Error("Expected toMove to be an object.");
  }

  if (opts.constructor !== Object) {
    throw new Error("Expected opts to be an object.");
  }

  // Begin check
  Object.keys(toMove).forEach(function(fromPath) {
    var toPath = toMove[fromPath];

    var files = explore(fromPath, []);
  });
};
