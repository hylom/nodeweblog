
/*
 * GET home page.
 */

exports.admin = require('./admin');
exports.story = require('./story');
var stories = require('../models/stories');

exports.index = function(req, res){
  stories.getLatest(10, function (err, items){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    if (items === null) {
      res.send(404, '404: Not Found.');
      return;
    }
    res.render('index', {
      page: { title: 'nblog' },
      user: req.session.user || false,
      stories: items
    });
  });
};

exports.tag = function(req, res){
  stories.getByTag(req.params.tag, 10, function (err, items){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    if (items === null) {
      res.send(404, '404: Not Found.');
      return;
    }
    res.render('index', {
      page: { title: 'nblog: ' + req.params.tag },
      user: req.session.user || false,
      stories: items
    });
  });
};

exports.single = function(req, res){
  stories.getByUrl(req.params.url, function (err, item){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    if (item === null) {
      res.send(404, '404: Not Found.');
      return;
    }
    res.render('single', {
      page: { title: 'nblog' },
      user: req.session.user || false,
      story: item
    });
  });
};

