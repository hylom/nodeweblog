
/*
 * GET home page.
 */

exports.admin = require('./admin');
var stories = require('../models/stories');

exports.index = function(req, res){
  stories.getLatest(10, function (err, items){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    console.log('render');
    res.render('index', {
      page: { title: 'nblog' },
      user: req.session.user || false,
      blog: req.app.get('blogInfo'),
      stories: items,
    });
  });
};

