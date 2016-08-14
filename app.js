require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var helmet = require('helmet');

var Promise = require('bluebird');

// using watchdog to rejoin the mesh network on disconnect
var watchout = require('watchout');

var watchdog = new watchout(12000, function(haltedTimeout){
    console.log('I should execute much later.');
    //rocess.exit(1);
// rejoin forever :D
  //  seneca  .use('redis-transport').use('mesh',
  // {
  //   listen: [
  //     { pin: 'role: cloudinary' },
  //       {model:'observe', type:'redis',  port: 6379} 
  //   ],
  //   // required to be detect the base 39999 is the default port
  //   bases: ['127.0.0.1:39999', 'irehearse-habashy.herokuapp.com:80'],
  //   //  host: 'ir-seneca-batch.herokuapp.com'
  // });

})

seneca = require('seneca')({
  timeout: 30000,
  tag: 'batch',
  log:'test',
    transport:{
      redis:{
        timeout:30000,
         url:process.env.REDIS_URL
      }
    }
  // transport: {host: '46.137.168.242'}
}) .use('redis-transport')
 .client({type:'redis'})
   .listen({type:'redis'})
// .use('mesh',
//   {
//     listen: [
//       { pin: 'role: cloudinary' },
//       {model:'observe', type:'redis',  port: 6379} 
//     ],
//     // required to be detect the base 39999 is the default port
//     bases: ['127.0.0.1:39999', 'irehearse-habashy.herokuapp.com:80'],
//     //  host: 'ir-seneca-batch.herokuapp.com'
//   })

seneca.pact = Promise.promisify(seneca.act, { context: seneca });

// first reset it before running 
setTimeout(function(){
  watchdog.reset();
},3000);

seneca.add({role: 'system',cmd: 'watchdog' }, function(args, done){
  // when comes from the server reset the watchdog
  watchdog.reset();
  console.log("done reset");
   done(null,{"cloudinary":this.id});
    //  seneca.pact('role:Dummy1,cmd:hello').then(function ( result) {
          
    //         console.log('Dummy 1 result:', result);

    //           seneca.pact('role:Dummy2,cmd:hello').then( function ( result2) {
        
    //         console.log('Dummy 2 result:', result2);
          
    //     });
    //     }).catch(function(err){

    //        if (err) throw err;
    //     });
      
   

});


setInterval(function(){
seneca.pact(('role:Dummy1,cmd:hello'))
    .then(function (live) {
        console.log("Live Nodes: "+ JSON.stringify( live));
    }).catch(function(err){

           if (err) throw err;
        });
}, 7000);

setInterval(function(){
seneca.pact(('role:Dummy2,cmd:hello'))
    .then(function (live) {
        console.log("Live Nodes: "+ JSON.stringify( live));
    }).catch(function(err){

           if (err) throw err;
        });
}, 3000);
seneca.use('../bat/cloudinary_clean.js');


var app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
