// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var filemanager = exports;
var users = require('../models/users');
var stories = require('../models/stories');

filemanager.index = function(req, res) {
  if (req.session.user === undefined) {
    res.redirect(403, '/');
    return;
  }
  var page = {
    title: 'File Manager'
  };
  stories.getBySid(req.params.sid, function(err, story) {
  if (req.session.user === undefined) {
    res.redirect(403, '/');
    return;
  }
    res.render('filemanager/filemanager', {
      page: page,
      user: req.session.user,
      error: 200,
    });
  });
}

