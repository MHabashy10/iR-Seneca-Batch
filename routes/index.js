/* 
    Created by Mohamed Habashy
 */

var express = require('express');
var router = express.Router();



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

 return  seneca.pact({ role: 'cloudinary', cmd: 'delete', public_ids: count.not })
      .then(function (deleted) {

        res.status(200).json({ deleted:{deleted:deleted, delete_count:_.pairs (deleted).length}, count: count, medias: val });
      });
      //  res.status(200).json({ count: count, images: val });
      });


    }).
    catch(
    // Log the rejection reason
    function (reason) {
      res.status(400).json({ images: 'error retriving data' + reason });
    });



});



module.exports = router;
