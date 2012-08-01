// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var stories = require('stories').connect(app.get('user'), 
					 app.get('database'),
					 app.get('passwd'));
var admin = exports;

admin.login = function(req, res){
  res.render('admin/login', {
    page: {
      title: 'nblog',
    },
    blog: app.get('blog'),
    stories: stories.latest(10)
    title: 'Express'
  });
};
