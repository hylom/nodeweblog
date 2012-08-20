// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var admin = exports;
var users = require('../models/users');
var stories = require('../models/stories');

admin.account = function(req, res) {
  // 操作には認証が必須
  if (req.session.user === undefined) {
    res.redirect('/');
    return;
  }

  function get(req, res, message) {
    // GETリクエストの場合
    var page = {
      title: 'Account Settings'
    };
    res.render('admin/account', {
      page: page,
      user: req.session.user,
      error: 200,
      errorMessage: message
    });
  }

  function post(req, res) {
    // POSTリクエストの場合

    // パスワードのアップデート処理の場合
    if (req.body.op == 'password') {
      // 入力された新パスワードが一致していなければエラー
      if (req.body.password != req.body.password2) {
        var message = 'New password does not match.'
        return get(req, res, message);
      }

      // パスワード更新処理を実行
      req.session.user.password = req.body.password;
      users.update(req.session.user, req.body.oldPassword, function (err) {
        var message = 'Account updated.';
        if (err) {
          message = err.message;
        }
        return get(req, res, message);
      });
    }
  }

  // 処理に応じて分岐
  if (req.method == 'POST') {
    post(req, res);
  } else {
    get(req, res);
  }
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
