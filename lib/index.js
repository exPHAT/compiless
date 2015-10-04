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
  if (startPath !== undefined && startPath.constructor !== String) {
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

  if (opts.less.paths === undefined) {
    opts.less.paths = [];
  }

  // Begin check
  Object.keys(toMove).forEach(function(fromPath) {
    // Convert to absolute paths
    var toPath = path.join(startPath, toMove[fromPath]);
    fromPath = path.join(startPath, fromPath);

    var dirsToCreate = []; // Directories that should be created
    var pathParts = toPath.split("/");

    for (var i = 0; i < pathParts.length; i++) {
      dirsToCreate.push(pathParts.slice(0, i+1).join("/")); // Create all sub directories
    }

    var files = explore(fromPath, [], dirsToCreate);

    // Create all dirs
    dirsToCreate.forEach(function(dir) {
      // Use relative path to get the appropreate path
      dir = path.join(toPath, path.relative(fromPath, dir));

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    });

    files.forEach(function(file) {
      // Extact the extension of the file
      var ext = file.match(/\.(.*)$/);
      if (ext && ext[1]) {
        ext = ext[1];
      }
      else {
        return;
      }

      // Create final path
      var newPath = path.join(toPath, path.relative(fromPath, file));
      var contents = fs.readFileSync(file);

      if (ext === "less") {
        // Compile the LESS file

        opts.less.paths.push(fromPath); // Add file path

        less.render(contents.toString(), opts.less, function(err, output) {
          if (err) {
            console.log("CompiLESS: "+err);
            return;
          }

          // Convert extension to CSS
          fs.writeFileSync(path.join(newPath, "..", path.basename(file, ".less"))+".css", new Buffer(output.css));
        });
      }
      else {
        // Export all other files
        
        fs.writeFileSync(newPath, contents);
      }
    });
  });
};
