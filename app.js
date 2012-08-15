
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var mongodb = require('mongodb');
var mongoStore = require('connect-mongodb');

var app = express();

app.configure(function(){
  //TODO
  var blog = {
    title: 'nblog',
    description: 'nblog blog system',
  };
  app.set('blogInfo', blog);

  //TODO
  app.locals.blog = blog;

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('somethingforhash'));

  // Session settings
  var mongoOptions = {
//    auto_reconnect: true,
//    native_parser: true
  };
  var mongoServer = new mongodb.Server('dev.w3jp.info', 4444, mongoOptions);
  var db = new mongodb.Db('nbsession', mongoServer);

  app.use(express.session({
    key: 'sid',
    cookie: {},
    store: new mongoStore({
      db: db,
      username: 'nblog',
      password: 'Foo-Bar-2000'
    })
  }));

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/admin/login', routes.admin.login);
app.post('/admin/login', routes.admin.login);
app.get('/admin/logout', routes.admin.logout);
app.get('/admin/', routes.admin.index);
app.get('/admin/account', routes.admin.account);

app.get('/story/new', routes.admin.editstory);
app.post('/story/update', routes.story.update);

app.get('/:url', routes.single);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
