/* 
    Created by Mohamed Habashy
 */

var express = require('express');
var router = express.Router();
var seneca = require('seneca')({
  timeout: 500000
});
var Promise = require('bluebird');

seneca.pact = Promise.promisify(seneca.act, { context: seneca });

seneca.use('../bat/cloudinary_clean.js');

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: 'Express' });
});


router.get('/cloudinary', function (req, res, next) {
 var type = req.query.type;
  seneca.pact({ role: 'cloudinary', cmd: 'fetch', type: type }).then(function (val) {
       // Log the fulfillment value
      //console.log(val.length);
      // compare with the already used media
    return  seneca.pact({ role: 'fb', cmd: 'compare', type: type, media: val })
      .then(function (count) {

        res.status(200).json({ count: count, images: val });
      });


    }).
    catch(
    // Log the rejection reason
    function (reason) {
      res.status(400).json({ images: 'error retriving data' + reason });
    });



});



module.exports = router;
