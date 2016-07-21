/* cloudinary_clean.js
    Created by Mohamed Habashy
 */

//var cloudinary = require('cloudinary');



module.exports = function () {
    var seneca = this;
    var data = [];

    seneca.add({
        role: 'fb',
        cmd: 'compare'
    }, compare_items);
    seneca.add({
        role: 'cloudinary',
        cmd: 'fetch'
    }, find_Item);
    // ... other action definitions

    function find_Item(args, done) {


        cloudinary.api.resources(function (result) {
            //  concat the the media ref to data
            data = data.concat(result.resources);
            if (result.next_cursor) {
                // if next_crusor is available this means
                // that their is still more data
                // so we chain call this function
                setTimeout(function name(params) {
                    find_Item({
                        type: args.type,
                        next_cursor: result.next_cursor
                    }, done);
                }, 0);

            } else {
                // to empty data var so we don't just add to this global var
                var all = data;
                data = [];
                done(null, all);
            }

        }, {
                resource_type: args.type,
                next_cursor: args.next_cursor,
                max_results: 500
            });


    }

    function compare_items(args, done) {
        var promises = [];
        var count = {
            exist: 0,
            not: 0,
            total: 0
        }
        var mediaType = (args.type == 'image') ? 'photos' : 'videos';

        // for (var i = 0; i < args.media.length; i++) {

        //     promises.push(fb.child(mediaType).orderByChild('media').equalTo(args.media[i].public_id).once("value"));
        // }


        // we should look for the publid_id which is not used anymore
        fb.child(mediaType).orderByChild('media').once("value").then(function (mediaSnaps) {
            count.total = args.media.length;
           count.not = _.filter(args.media, function (media) {

                return _.isEmpty( _.where(_.toArray(mediaSnaps.val()), { media: media.public_id }));
            });
            count.exist =  count.total -  count.not.length;
             done(null, count);

        });

        // Promise.all(promises).then(function (mediaSnaps) {
        //     count.total = mediaSnaps.length;

        //     for (var i = 0; i < mediaSnaps.length; i++) {
        //         if (mediaSnaps[i].exists()) {
        //             ++count.exist;
        //         } else {
        //             ++count.not;

        //         }
        //     }
        // ... perform item creation
       

        //   })

    }
};
