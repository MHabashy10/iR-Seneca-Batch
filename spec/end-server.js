var Jasmine = require('jasmine');
var jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');
var node = require('../bin/www');



jasmine.execute();


jasmine.onComplete(function(passed) {
    node.closeServer();
    if(passed) {
        console.log('All specs have passed');
    }
    else {
        console.log('At least one spec has failed');
    }
});