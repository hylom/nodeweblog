
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var url = require('url');
var fs = require('fs');

var MemcachedStore = require('connect-memcached')(express);
var config = require('./config');
var app = express();
var embedIframe = require('./embedIframe');
var logger = require('./connect-fluent-logger');

app.configure(function(){
  app.set('config', config);
  app.locals.blog = config.blogInfo;

  app.set('port', process.env.PORT || config.port || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());

  // setting for logging
  // when nodeweblog does not run under root privilleges,
  // use 'dev' style logging.
  if (process.env.NODE_ENV === 'development' || 
      (process.getuid() !== 0)) {
    app.use(express.logger('dev'));
  } else {
    // if config.accessLog is exists, output logs to the file.
    var logStream;
    if (config.accessLog) {
      logStream = fs.createWriteStream(config.accessLog, {flags: 'a'});
    }
    app.use(express.logger({
      format: 'default',
      stream: logStream || process.stdout
    }));
    app.use(logger({tag:"nodeweblog"}));
  }

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.cookieHash));
  app.use(express.session({
    key: 'sid',
    cookie: {},
    store: new MemcachedStore
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

  // embed iframe
  embedOptions = {
    'acceptableHosts': ['gist.github.com'],
    'useCSS': '/css/bootstrap.min.css'
  };
  app.use('/embed/', embedIframe(embedOptions));

  // use proxy
  if (config.useProxy) {
    //var proxy = require('proxy-middleware');
    var proxy = require('./proxy-m');
    var proxyOptions = url.parse(config.proxyUrl);
    proxyOptions.headers = {'host': config.proxyHost};
    app.use(proxy(proxyOptions));
  }
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/admin/login', routes.admin.login);
app.post('/admin/login', routes.admin.login);
app.get('/admin/logout', routes.admin.logout);
// app.get('/admin/', routes.admin.index);
app.get('/admin/account', routes.admin.account);
app.post('/admin/account', routes.admin.account);

app.get('/story/new', routes.admin.newstory);
app.get('/story/edit/:sid', routes.admin.editstory);
app.post('/story/update', routes.story.update);

app.get('/tag/:tag', routes.tag);
app.get('/tag/:tag/page/:page', routes.tag);
app.get('/page/:page', routes.index);
app.get('/:url', routes.single);
app.get('/', routes.index);

app.get('/filemanager/', routes.filemanager.index);

http.createServer(app).listen(app.get('port'), function () {
  if ((config.nodeUser !== undefined) && (process.getuid() == 0) ){
    process.setgid(config.nodeUser.gid);
    process.setuid(config.nodeUser.uid);
  }
  console.log("Express server listening on port " + app.get('port'));
});
