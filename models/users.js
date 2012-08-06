// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var crypto = requre('crypto');
var mysql = require('mysql');
var modelbase = require('./modelbase');

// Users: ユーザー情報にアクセスするためのクラス
function Users(dbAuth) {
  this.dbAuth = dbAuth;
}
Users.prototype = new modelbase.ModelBase();

// Usersオブジェクトを返す
exports.connect = function (dbAuth) {
  return new Users(dbAuth);
}

// ユーザー名からアカウント情報を取得する
Users.prototype.getByUsername = function (uname, callback) {
  this.query('SELECT * FROM users WHERE uname = ?',
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
Users.prototype._hashPassword = function (passwd) {
  shasum = crypto.createHash('sha256');
  shasum.update(passwd);
  return shasum.digest('hex');
}

// アカウント情報をアップデートする
Users.prototype.update = function (user, callback) {
  var params = [
    user.uname,
    this._hashPassword(user.passwd),
    user.uid
  ];
  this.query(
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

