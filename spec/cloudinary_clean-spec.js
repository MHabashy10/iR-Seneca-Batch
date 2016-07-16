
var node = require('../bin/www');

var request = require("request-promise");

var base_url = "http://localhost:3000/";

describe("Hello World Server", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        console.log("done app");
        node.closeServer();
        done();
      });
    });

    // it("returns Hello World", function(done) {
    //   request.get(base_url, function(error, response, body) {
    //     expect(body).toBe("Hello World");
    //     done();
    //   });
    // });
  });
});



