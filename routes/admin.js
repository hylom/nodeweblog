// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var admin = exports;
var users = require('../models/users');

admin.index = function(req, res) {
  if (req.session.uid === undefined) {
    res.redirect('/admin/login');
    return;
  }
  res.render('admin/index', {
    uname: req.session.uid,
    error: 200,
  });
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
      req.session.uid = userInfo.uid;
      res.redirect('/admin/');
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
