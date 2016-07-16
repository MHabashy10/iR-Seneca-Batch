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

  seneca.pact({ role: 'cloudinary', cmd: 'clean', type: 'image' }).then(
    // Log the fulfillment value
    function (val) {
      console.log(val.length);

      res.status(200).json({ size: val.length, images: val });

    }).
    catch(
    // Log the rejection reason
    function (reason) {
      res.status(400).json({ images: 'error retriving data' + reason });
    });



});



module.exports = router;
