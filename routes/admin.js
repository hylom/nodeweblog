// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var admin = exports;

admin.login = function(req, res){
  if (req.method == 'POST') {
    var uname = req.body.uname || '';
    var passwd = req.body.passwd || '';
    res.render('admin/login', {
      uname: uname,
      error: 200
    });
    return;
  }
  res.render('admin/login', {
    uname: '',
    error: 200
  });
};
