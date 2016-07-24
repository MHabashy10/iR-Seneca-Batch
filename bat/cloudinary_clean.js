/* cloudinary_clean.js
    Created by Mohamed Habashy
 */

//var cloudinary = require('cloudinary');

"use strict";

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
                find_Item({
                    type: args.type,
                    next_cursor: result.next_cursor
                }, done);

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
        var allMedia = [];
        var count = {
            exist: 0,
            not: 0,
            total: 0
        };
        var mediaType = (args.type == 'image') ? 'photos' : 'videos';

        // for (var i = 0; i < args.media.length; i++) {
        if (args.type == 'image') {
            // if image add the users and studioes avatar
            promises.push(fb.child('users').orderByChild('avatar').once("value"));
            promises.push(fb.child('studios').orderByChild('logo').once("value"));

            // adding default media missing_profile
            allMedia.push({ media: 'missing_profile' });
      

        }

        // }


        // we should look for the publid_id which is not used anymore
        promises.push(fb.child(mediaType).orderByChild('media').once("value"));


        Promise.all(promises).then(function (mediaSnaps) {
            //     count.total = mediaSnaps.length;

            //     for (var i = 0; i < mediaSnaps.length; i++) {
            //         if (mediaSnaps[i].exists()) {
            //             ++count.exist;
            //         } else {
            //             ++count.not;

            //         }
            //     }


            if (args.type == 'image') {

                // combine stage 
                for (var i = 0; i < mediaSnaps.length; i++) {
                    for (var j = 0; j < _.toArray(mediaSnaps[i].val()).length; j++) {
                        var media = _.toArray(mediaSnaps[i].val());
                        allMedia.push({ media: media[j].media || media[j].avatar || media[j].settings.logo });

                    }

                }




            } else {
                allMedia = mediaSnaps[0].val();
            }
            // ... perform item creation  
            count.total = args.media.length;
            count.not = _.filter(args.media, function (media) {
                if (media.public_id.includes('iRehearse/')) return false;
                return _.isEmpty(_.where(_.toArray(allMedia), { media: media.public_id }));
            });
            count.exist = count.total - count.not.length;
            done(null, count);


        });

    }
};
