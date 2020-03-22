import {
  lstat,
  readdir,
  pathExists,
  mkdir,
  readFile,
  writeFile
} from "fs-extra";
import path from "path";
import {renderLessAsync} from "./less";


/*
 * Determine if a path is a directory
 * @param {String} pth  Tthe absolute path to the possible directory
 * @returns {Boolean} If the specified path is a directory
 */
async function isDir(pth: string): Promise<boolean> {
  return (await pathExists(pth)) && (await lstat(pth)).isDirectory();
}

/*
 * The main recursive function that explores directories
 * @param {String} pth    the directory to explore
 * @param {Array} list    the current list of found files
 */
async function explore(pth: string, list: String[], dirsToCreate: any): Promise<any> {
  dirsToCreate.push(pth); // Store directories that need to be created

  var contents = await readdir(pth);
  for (let item of contents) {
    const itemPath = path.join(pth, item);

    if (await isDir(itemPath)) {
      await explore(itemPath, list, dirsToCreate);
    } else {
      list.push(itemPath);
    }
  }

  return list;
}

/*
 * The main module itself
 * @param {String} startPath     The path that all data is relative to (generally __dirname)
 * @param {Object} toMove        The directories to be explored and exported
 * @param {Object} opts          An optional argument of options to be used
 * @param {Integer} opts.depth   How deep the recursive search should go
 * @param {Object} opts.less     Any options to pass to the LESS renderer
 */
export = async function compiless(
  startPath: string,
  toMove: {
    [key: string]: string;
  },
  opts: {
    depth?: number;
    less?: {
      paths?: string[];
    }
  } = {}
): Promise<String[]> {
  // Ensure module was used properly
  if (!startPath || typeof startPath !== "string") {
    throw new Error("Expected startPath to be a string.");
  }

  if (!toMove || typeof toMove !== "object") {
    throw new Error("Expected toMove to be an object.");
  }

  if (!(opts instanceof Object)) {
    throw new Error("Expected opts to be an object.");
  }

  if (opts.depth === undefined) {
    opts.depth = 0;
  }
  if (opts.less === undefined) {
    opts.less = {};
  }

  if (opts.less?.paths === undefined) {
    opts.less.paths = [];
  }

  for (let fromPath in toMove) {
    // Convert to absolute paths
    const toPath = path.join(startPath, toMove[fromPath]);
    fromPath = path.join(startPath, fromPath);

    const dirsToCreate = []; // Directories that should be created
    const pathParts = toPath.split("/");

    for (let i = 0; i < pathParts.length; i++) {
      dirsToCreate.push(pathParts.slice(0, i + 1).join("/")); // Create all sub directories
    }

    const files = await explore(fromPath, [], dirsToCreate);

    // Create all dirs
    for (let dir of dirsToCreate) {
      // Use relative path to get the appropreate path
      dir = path.join(toPath, path.relative(fromPath, dir));

      if (!(await pathExists(dir))) {
        await mkdir(dir);
      }
    }

    for (let file of files) {
      // Extact the extension of the file
      let ext = file.match(/\.(.*)$/);
      if (ext && ext[1]) {
        ext = ext[1];
      } else {
        // TODO: Log warning here? "Unable to process file extension"
        continue;
      }

      // Create final path
      const newPath = path.join(toPath, path.relative(fromPath, file));
      const contents = await readFile(file);

      if (ext === "less") {
        // Compile the LESS file

        opts.less.paths.push(fromPath); // Add file path

        try {
          const output = await renderLessAsync(contents.toString(), opts.less);

          let css = "";
          if (output?.css) {
            css = output.css;
          }

          // Convert extension to CSS
          await writeFile(
            path.join(newPath, "..", path.basename(file, ".less")) + ".css",
            Buffer.alloc(css.length, css)
          );
        } catch (err) {
          console.log("CompiLESS: " + err);
          continue;
        }
      } else {
        // Export all other files

        await writeFile(newPath, contents);
      }
    }
  }

  return [];
}
