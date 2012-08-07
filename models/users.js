// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var crypto = require('crypto');
var database = require('./database');
var db = new database.Database();

// 認証を行う
exports.authenticate = function (uname, passwd, callback) {
  db.query('SELECT * FROM users WHERE uname = ?',
	     [uname,], queryCallback);
  function queryCallback(err, results, fields) {
    if (err) {
      callback(err, null);
      return;
    }
    if (results && (results.length > 0)) {
      userInfo = results[0];
      if (userInfo.passwd == hashPassword(passwd)) {
	delete userInfo.passwd;
	callback(false, userInfo);
	return;
      }
    }
    // 該当ユーザー無し
    callback(err, null);
    return;
  }
}

// ユーザー名からアカウント情報を取得する
exports.getByUsername = function (uname, callback) {
  db.query('SELECT * FROM users WHERE uname = ?',
	     [uname,], queryCallback);
  function qurryCallback(err, results, fields) {
    if (err) {
      callback(err, undefined);
      return;
    }
    if (results && (results.length > 0)) {
      userInfo = results[0];
      delete userInfo.passwd;
      callback(false, userInfo);
    } else {
      callback(false, null);
    }
  }
}
  
// パスワードのハッシュを作成する
var hashPassword = function (passwd) {
  if (passwd === '') {
    return '';
  }
  var shasum = crypto.createHash('sha256');
  shasum.update(passwd);
  return shasum.digest('hex');
}

// アカウント情報をアップデートする
exports.update = function (user, callback) {
  var params = [
    user.uname,
    hashPassword(user.passwd),
    user.uid
  ];
  db.query(
    'UPDATE users '
      + 'SET '
      + 'uname = ?,'
      + 'passwd = ?'
      + 'WHERE uid = ?'
      + ';',
    params, function(err, results, fields) {
      callback(err);
    });
};

