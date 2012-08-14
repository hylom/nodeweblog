// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var admin = exports;
var users = require('../models/users');
var stories = require('../models/stories');

admin.account = function(req, res) {
  if (req.session.user === undefined) {
    res.redirect('/');
    return;
  }
  var page = {
    title: 'Account Settings'
  };
  res.render('admin/account', {
    page: page,
    user: req.session.user,
    error: 200,
  });
}

admin.editstory = function(req, res) {
  if (req.session.user === undefined) {
    res.redirect(403, '/');
    return;
  }
  var page = {
    title: 'New Story'
  };
  var story = stories.newStory();
  res.render('admin/storyeditor', {
    story: story,
    page: page,
    user: req.session.user,
    error: 200,
  });
}

admin.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
}

admin.login = function(req, res) {
  if (req.method == 'POST') {
    var uname = req.body.uname || '';
    var passwd = req.body.passwd || '';
    
    users.authenticate(uname, passwd, authCallback);
    function authCallback(err, userInfo) {
      if (err || userInfo === null) {
	// 認証に失敗
	res.render('admin/login', {
	  uname: uname,
	  error: 200,
	  loginFailed: true
	});
	return;
      }
      // 認証に成功
      req.session.user = {
	uid: userInfo.uid,
	name: userInfo.uname
      };
      res.redirect('/');
      return;
    }
  } else {
    // POST以外のリクエストに対する処理
    res.render('admin/login', {
      uname: uname,
      error: 200,
      loginFailed: false
    });
  }
};
