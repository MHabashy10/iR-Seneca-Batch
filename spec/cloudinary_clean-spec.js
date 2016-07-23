/* 
    Created by Mohamed Habashy
 */
var node = require('../bin/www');

var request = require("request-promise");


var base_url = "http://localhost:3000/";



describe("Cloudinary Clean", function () {


  afterAll(function () {
    // Shut the server down when we're done
    node.closeServer();
  });
  describe("Routes", function () {


    it("Get / should returns status code 200", function (done) {
      request.get(base_url, function (error, response, body) {
        expect(response.statusCode).toBe(200);

        done();
      },2000);
    });

    it("Get /anything should returns status code 404", function (done) {
      request.get(base_url+'anything', function (error, response, body) {
        expect(response.statusCode).toBe(404);

        done();
      },2000);
    });

    it("Get /cloudinary should returns status code 200 & images ", function (done) {
      request.get(base_url + 'cloudinary?type=image', function (error, response, body) {

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(body).count.total).not.toBeLessThan(JSON.parse(body).count.not);

        expect(JSON.parse(body).count.exist.length).not.toBeGreaterThan(JSON.parse(body).count.total);

        expect(JSON.parse(body).images).toBeTruthy();

        done();
      });
    }, 50000);

        it("Get /cloudinary should returns status code 200 & videos ", function (done) {
      request.get(base_url + 'cloudinary?type=video', function (error, response, body) {

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(body).count.total).not.toBeLessThan(JSON.parse(body).count.not);

        expect(JSON.parse(body).count.exist.length).not.toBeGreaterThan(JSON.parse(body).count.total);

        expect(JSON.parse(body).images).toBeTruthy();

        done();
      });
    }, 50000);

    // it("returns Hello World", function(done) {
    //   request.get(base_url, function(error, response, body) {
    //     expect(body).toBe("Hello World");
    //     done();
    //   });
    // });
  });
});



