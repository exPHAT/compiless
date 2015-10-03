var expect = require("expect.js");
var remove = require("remove");
var path = require("path");
var fs = require("fs");
var compiless = require("../");

describe("compiless", function() {
  beforeEach(function() {
    var exportedPath = path.join(__dirname, "test-data", "public");

    if (fs.existsSync(exportedPath)) {
      remove.removeSync(exportedPath);
    }
  });

  it("should return a function", function() {
    expect(compiless).to.be.a(Function);
  });

  it("should throw an error if no arguments are given", function() {
    try {
      compiless();
      expect().fail("Did not throw an error");
    }
    catch (err) {
      expect(err).to.be.an(Error);
    }
  });

  it("should create any missing directories", function() {
    compiless(__dirname, {
      "./test-data/assets/": "./test-data/public"
    });
  });
});
