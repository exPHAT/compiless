var fs   = require("fs");
var path = require("path");
var less = require("less");

/*
 * The main module itself
 * @param {String} startPath     The path that all data is relative to (generally __dirname)
 * @param {Object} toMove        The directories to be explored and exported
 * @param {Object} opts          An optional argument of options to be used
 * @param {Integer} opts.depth   How deep the recursive search should go
 * @param {Object} opts.less     Any options to pass to the LESS renderer
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
  function explore(pth, list, dirsToCreate) {
    dirsToCreate.push(pth); // Store directories that need to be created

    var contents = fs.readdirSync(pth);
    contents.forEach(function(item) {
      var itemPath = path.join(pth, item);

      if (isDir(itemPath)) {
        explore(itemPath, list, dirsToCreate);
      }
      else {
        list.push(itemPath);
      }
    });

    return list;
  }


  // Ensure module was used properly
  if (startPath !== undefined && startPath.constructor === String) {
    throw new Error("Expected startPath to be a string.");
  }

  if (toMove !== undefined && toMove.constructor !== Object) {
    throw new Error("Expected toMove to be an object.");
  }

  if (opts === undefined) {
    opts = {};
  }
  
  if (opts.constructor !== Object) {
    throw new Error("Expected opts to be an object.");
  }

  if (opts.depth === undefined) {
    opts.depth = 0;
  }
  if (opts.less === undefined) {
    opts.less = {};
  }

  // Begin check
  Object.keys(toMove).forEach(function(fromPath) {
    var toPath = toMove[fromPath];

    var dirsToCreate = []; // Directories that should be created

    var files = explore(fromPath, [], dirsToCreate);
  });
};
