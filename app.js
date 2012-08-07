
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();

app.configure(function(){
  //TODO
  var blog = {
    title: 'nblog',
    description: 'nblog blog system',
  };
  app.set('blogInfo', blog);

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('somethingforhash'));

  app.use(express.session({
    key: 'sid',
    cookie: {}
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
app.get('/admin/', routes.admin.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
