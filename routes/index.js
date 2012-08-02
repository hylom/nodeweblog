
/*
 * GET home page.
 */

exports.admin = require('./admin');
var stories = require('../models/stories');

exports.index = function(req, res){
  var app = req.app;
  var conn = stories.connect(app.get('user'),
			     app.get('database'),
			     app.get('passwd'));
  conn.getLatest(10, function (err, items){
    if (err) {
      res.send(500, { error: 'internal server error' });
    }
    console.log('render');
    res.render('index', {
      page: {
        title: 'nblog',
      },
      blog: app.get('blog'),
      stories: items,
    });
  });
};

