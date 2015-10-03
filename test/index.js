var expect = require("expect.js");
var compiless = require("../");

describe("compiless", function() {
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
});
