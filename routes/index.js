
/*
 * GET home page.
 */

exports.admin = require('./admin');
var stories = require('../models/stories');

exports.index = function(req, res){
  var app = req.app;
  stories.getLatest(10, function (err, items){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    console.log('render');
    res.render('index', {
      page: {
        title: 'nblog',
      },
      blogInfo: app.get('blogInfo'),
      stories: items,
    });
  });
};

