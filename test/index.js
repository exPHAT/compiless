var expect = require("expect.js");
var remove = require("remove");
var path = require("path");
var fs = require("fs");
var compiless = require("../");

describe("compiless", function() {
  beforeEach(function() {
    var exportedPath = path.join(__dirname, "test-data", "exported");

    if (fs.existsSync(exportedPath)) {
      remove.removeSync(exportedPath);
    }
  });

  it("should return a function", function() {
    expect(compiless).to.be.a(Function);
  });

  it("should throw an error if no arguments are given", async function() {
    try {
      await compiless();
    } catch (err) {
      expect(err).to.be.an(Error);
      return;
    }
    expect().fail("Did not throw an error");
  });

  it("should create any missing directories", async function() {
    await compiless(__dirname, {
      "./test-data/assets/": "./test-data/exported"
    });

    expect(fs.existsSync(__dirname + "/test-data/exported")).to.eql(true);
  });

  it("should compile LESS", async function() {
    await compiless(__dirname, {
      "./test-data/assets/": "./test-data/exported"
    });

    var compiled = fs.readFileSync(__dirname + "/compiled.css").toString();
    var exported = fs
      .readFileSync(__dirname + "/test-data/exported/test.css")
      .toString();

    expect(exported).to.equal(compiled);
  });

  it("should copy any data that is not a LESS file normally", async function() {
    await compiless(__dirname, {
      "./test-data/assets/": "./test-data/exported"
    });

    var original = fs
      .readFileSync(__dirname + "/test-data/assets/hi.css")
      .toString();
    var exported = fs
      .readFileSync(__dirname + "/test-data/exported/hi.css")
      .toString();

    expect(exported).to.equal(original);
  });

  it("should handle sub-directories", async function() {
    await compiless(__dirname, {
      "./test-data/assets/": "./test-data/exported"
    });

    expect(fs.existsSync(__dirname + "/test-data/exported/subdir")).to.eql(
      true
    );
  });

  it("should handle files within these sub-directories", async function() {
    await compiless(__dirname, {
      "./test-data/assets/": "./test-data/exported"
    });

    expect(
      fs.existsSync(__dirname + "/test-data/exported/subdir/subfile.css")
    ).to.eql(true);
  });

  it("the contents in sub-directories should match", async function() {
    await compiless(__dirname, {
      "./test-data/assets/": "./test-data/exported"
    });

    var original = fs
      .readFileSync(__dirname + "/test-data/assets/subdir/yo.css")
      .toString();
    var exported = fs
      .readFileSync(__dirname + "/test-data/exported/subdir/yo.css")
      .toString();

    expect(original).to.equal(exported);
  });
});
