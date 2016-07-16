/* cloudinary_clean.js
    Created by Mohamed Habashy
 */

var cloudinary = require('cloudinary');


module.exports = function () {
    var seneca = this;
    var data = [];

    // seneca.add({role:'inventory', cmd:'create_item', create_item);
    seneca.add({
        role: 'cloudinary',
        cmd: 'clean'
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

    // function create_item(args, done) {
    //     var itemName = args.name;
    //     // ... perform item creation
    //     done(null, item);
    // }
};
